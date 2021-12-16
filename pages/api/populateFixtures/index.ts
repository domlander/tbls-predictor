/* eslint-disable camelcase */
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "prisma/client";
import * as Sentry from "@sentry/nextjs";

import { calculateCurrentGameweek } from "utils/calculateCurrentGameweek";
import { getSession } from "next-auth/client";
import { fetchFixtureFromFplApi, mapFplApiFixtureToFixture } from "./utils";
import { FixtureForPopulatingDb, FplApiFixture } from "./types";

const API_ENDPOINT = "https://fantasy.premierleague.com/api/fixtures";

/*
  Populates fixtures to the database using the FPL API.

  To Do:
    - If the Premier League API stops returning 200, I want to know about it. Log to Sentry.

  query params
   - gameweek: The gameweek in which to find fixtures. Defaults to the current gameweek.
   - persist: Whether to save the fixtures to the DB. Defaults to false.
*/
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (session.user.email !== process.env.ADMIN_EMAIL)
    return res.status(401).send("Unauthorised");

  const queryGameweek = parseInt(req.query.gameweek as string);
  const shouldSaveToDatabase = (req.query.persist as string) === "true";

  // Get fixtures from Database
  const allDbFixtures = await prisma.fixture.findMany();
  const gameweekToFetch =
    queryGameweek || calculateCurrentGameweek(allDbFixtures);
  const fixturesFromDb = allDbFixtures.filter(
    (fixture) => fixture.gameweek === gameweekToFetch
  );

  // Get fixtures from API
  const url = `${API_ENDPOINT}/?event=${gameweekToFetch}`;
  let apiData;
  try {
    apiData = await fetchFixtureFromFplApi(url);
  } catch (e) {
    throw new Error(
      `There was an error fetching fixture data from the FPL API:\n${e}`
    );
  }
  const fixturesFromApi: FixtureForPopulatingDb[] = apiData.map(
    (fixture: FplApiFixture) =>
      mapFplApiFixtureToFixture(fixture, gameweekToFetch)
  );

  // Don't save fixtures to database if requested
  if (!shouldSaveToDatabase)
    return res.status(200).json({ fixtures: fixturesFromApi });

  const fixturesToAdd: FixtureForPopulatingDb[] = [];
  const fixturesToUpdate: FixtureForPopulatingDb[] = [];
  const fixturesToDelete: FixtureForPopulatingDb[] = [];

  // Add fixtures that we don't have yet and amend kickoff where the date/time has changed
  fixturesFromApi.forEach((apiFixture) => {
    const matchingDbFixture = fixturesFromDb.find(
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
  fixturesFromDb.forEach((dbFixture) => {
    const matchingApiFixture = fixturesFromApi.find(
      (apiFixture) =>
        apiFixture.homeTeam === dbFixture.homeTeam &&
        apiFixture.awayTeam === dbFixture.awayTeam
    );

    if (!matchingApiFixture) {
      fixturesToDelete.push(dbFixture);
    }
  });

  // Update database
  let addPromises: Promise<any>[] = [];
  let updatePromises: Promise<any>[] = [];
  let deletePromises: Promise<any>[] = [];

  try {
    if (fixturesToAdd.length) {
      addPromises = fixturesToAdd
        .map(({ gameweek, homeTeam, awayTeam, kickoff }) => {
          Sentry.captureMessage(
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
          Sentry.captureMessage(
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
          Sentry.captureMessage(
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
      await Promise.all(promises);
    } else {
      Sentry.captureMessage(
        `The populateFixtures serverless function has been run and found no differences between the FPL API and the DB for gameweek ${gameweekToFetch}`
      );
    }
  } catch (e) {
    throw new Error(
      `Could not fetch FPL API fixture data. URL: ${url}. Error: ${e}`
    );
  }

  return res.status(200).json({ fixtures: fixturesFromApi });
};

export default Sentry.withSentry(handler);
