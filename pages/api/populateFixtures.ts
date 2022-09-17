/* eslint-disable camelcase */
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "prisma/client";
import * as Sentry from "@sentry/nextjs";

import { calculateCurrentGameweek } from "utils/calculateCurrentGameweek";
import { getSession } from "next-auth/react";
import Fixture from "src/types/Fixture";
import { getFixturesFromApiForGameweek } from "utils/fplApi";

/*
  Adds or updates fixtures in the database using the FPL fixtures API.

  Params:
   - gameweek: The gameweek in which to update fixtures. Defaults to the current gameweek
   - (optional) numGameweeks: number of gameweeks to update, starting from provided gameweek. Defaults to 1
   - (optional) secret: authenticates caller
   - (optional) persist: Whether to save the fixtures to the DB. Defaults to false
*/
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const secret = req.query.secret as string;
  const queryGameweek = parseInt(req.query.gameweek as string);
  const numGameweeks = parseInt(req.query.numGameweeks as string) || 1;
  const shouldSaveToDatabase = (req.query.persist as string) === "true";

  if (!process.env.ADMIN_EMAIL)
    return res
      .status(500)
      .send("Please ensure the ADMIN_EMAIL environment variable is set.");

  if (!process.env.ACTIONS_SECRET)
    return res
      .status(500)
      .send("Please ensure the ACTIONS_SECRET environment variable is set.");

  const session = await getSession({ req });
  if (
    session?.user?.email !== process.env.ADMIN_EMAIL &&
    secret !== process.env.ACTIONS_SECRET
  ) {
    return res.status(401).send("Unauthorised");
  }

  const allDbFixtures = await prisma.fixture.findMany();

  const defaultGameweek = calculateCurrentGameweek(allDbFixtures);
  const gameweek = queryGameweek || defaultGameweek;

  const allApiFixtures = await fetchApiData(gameweek, numGameweeks);
  const apiFixturesFlat = allApiFixtures.flat(1);

  if (!shouldSaveToDatabase) {
    return res.status(200).json({ fixtures: apiFixturesFlat });
  }

  // Synchronously update the fixtures in the requested gameweeks.
  for (let i = gameweek; i <= Math.min(gameweek + numGameweeks - 1, 38); i++) {
    const dbFixtures = allDbFixtures.filter(({ gameweek: week }) => week === i);
    const apiFixtures = allApiFixtures[i - gameweek];

    populateFixtures(i, apiFixtures, dbFixtures);
  }

  return res.status(200).json({ fixtures: apiFixturesFlat });
};

/*
 * Fetches all the api data we need to process this serverless function
 */
const fetchApiData = async (gameweek: number, numGameweeks: number) => {
  const results = [];
  for (let i = gameweek; i <= Math.min(gameweek + numGameweeks - 1, 38); i++) {
    results.push(getFixturesFromApiForGameweek(i));
  }

  const data = await Promise.all(results);
  return data;
};

/*
  Compares the up-to-date API fixtures with the existing fixtures in the DB
   - Creates new fixtures where there isn't an equivalent match
   - Updates fixtures where details have changed (Only kickoff for now - possibly score too in the future)
   - Deletes fixtures which no longer exist. An example being postponements.

  Persists the updates to the database
*/
const populateFixtures = async (
  theGameweek: number,
  apiFixtures: Fixture[],
  dbFixtures: Fixture[]
) => {
  const fixturesToAdd: Fixture[] = [];
  const fixturesToUpdate: Fixture[] = [];
  const fixturesToDelete: Fixture[] = [];

  // Add fixtures that we don't have yet and amend kickoff where the date/time has changed
  apiFixtures.forEach((apiFixture) => {
    const matchingDbFixture = dbFixtures.find(
      (dbFixture) =>
        dbFixture.homeTeam === apiFixture.homeTeam &&
        dbFixture.awayTeam === apiFixture.awayTeam
    );

    if (!matchingDbFixture) {
      fixturesToAdd.push(apiFixture);
    } else if (
      // Update fixtures whose kickoff time has changed.
      apiFixture.kickoff.getTime() !== matchingDbFixture.kickoff.getTime()
    ) {
      fixturesToUpdate.push({
        ...apiFixture,
        id: matchingDbFixture.id,
      });
    }
  });

  // Delete fixtures that no longer exist in this gameweek. Cheers Covid.
  dbFixtures.forEach((dbFixture) => {
    const matchingApiFixture = apiFixtures.find(
      (apiFixture) =>
        apiFixture.homeTeam === dbFixture.homeTeam &&
        apiFixture.awayTeam === dbFixture.awayTeam
    );

    if (!matchingApiFixture) {
      fixturesToDelete.push(dbFixture);
    }
  });

  let addPromises: Promise<any>[] = [];
  let updatePromises: Promise<any>[] = [];
  let deletePromises: Promise<any>[] = [];

  // Create the prisma promises for add, update and delete DB updates
  const logMessages: string[] = [];
  if (fixturesToAdd.length) {
    addPromises = fixturesToAdd
      .map(({ gameweek, homeTeam, awayTeam, kickoff }) => {
        logMessages.push(
          `\nFixture added: ${homeTeam} hosting ${awayTeam} at ${kickoff.toLocaleDateString()} in week ${gameweek}.`
        );
        return prisma.fixture.create({
          data: {
            gameweek,
            homeTeam,
            awayTeam,
            kickoff,
          },
        });
      })
      ?.filter((x) => !!x);
  }
  if (fixturesToUpdate.length) {
    updatePromises = fixturesToUpdate
      .map(({ id, gameweek, homeTeam, awayTeam, kickoff }) => {
        logMessages.push(
          `\nFixture amended: ID: ${id}. ${homeTeam} hosting ${awayTeam} at ${kickoff.toLocaleDateString()} in week ${gameweek}.`
        );
        return prisma.fixture.update({
          where: {
            id,
          },
          data: {
            gameweek,
            homeTeam,
            awayTeam,
            kickoff,
          },
        });
      })
      ?.filter((x) => !!x);
  }
  if (fixturesToDelete.length) {
    deletePromises = fixturesToDelete
      .map(({ id, gameweek, homeTeam, awayTeam, kickoff }) => {
        logMessages.push(
          `\nFixture deleted: ID: ${id}. ${homeTeam} hosting ${awayTeam} at ${kickoff} in week ${gameweek}.`
        );
        return prisma.fixture.delete({
          where: {
            id,
          },
        });
      })
      ?.filter((x) => !!x);
  }

  const promises = addPromises.concat(updatePromises, deletePromises);

  if (promises?.length) {
    await Promise.all(promises).then(() => {
      logMessages.forEach((message) => {
        Sentry.captureMessage(message);
      });
    });
  } else {
    Sentry.captureMessage(
      `The populateFixtures serverless function has been run and found no differences between the FPL API and the DB for gameweek ${theGameweek}`
    );
  }
};

export default Sentry.withSentry(handler);
