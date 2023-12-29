import { getServerSession } from "next-auth/next";
import * as Sentry from "@sentry/nextjs";
import dayjs from "dayjs";

import prisma from "prisma/client";
import { calculateCurrentGameweek } from "utils/calculateCurrentGameweek";
import { getFixturesFromApiForGameweek } from "utils/fplApi";
import Fixture from "src/types/Fixture";
import LogMessage, { LOG_MESSAGE_TYPE } from "src/types/LogMessage";
import clientPromise from "../../../lib/mongodb";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextRequest } from "next/server";
import sortFixtures from "utils/sortFixtures";

const getGameweekFromParam = (param: string | null) => {
  if (param === null) {
    return null;
  }

  const gameweek = parseInt(param);
  if (gameweek >= 1 && gameweek <= 38) {
    return gameweek;
  }

  return null;
};

const getNumGameweeksFromParam = (param: string | null) => {
  if (param === null) {
    return 1;
  }

  const numGameweeks = parseInt(param);
  if (numGameweeks >= 1 && numGameweeks <= 38) {
    return numGameweeks;
  }

  return 1;
};

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
   - Deletes fixtures which no longer exist, e.g. postponements.

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

  // Add fixtures that we don't have yet AND amend kickoff where the date/time has changed
  apiFixtures.forEach((apiFixture) => {
    const matchingDbFixture = dbFixtures.find(
      (dbFixture) =>
        dbFixture.homeTeam === apiFixture.homeTeam &&
        dbFixture.awayTeam === apiFixture.awayTeam
    );

    if (!matchingDbFixture) {
      fixturesToAdd.push(apiFixture);
    } else if (
      // Update fixtures whose kickoff time or score has changed.
      apiFixture.kickoff.getTime() !== matchingDbFixture.kickoff.getTime() ||
      apiFixture.homeGoals !== matchingDbFixture.homeGoals ||
      apiFixture.awayGoals !== matchingDbFixture.awayGoals
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

  const now = dayjs();

  // Create the prisma promises for add, update and delete DB updates
  const logMessages: LogMessage[] = [];
  if (fixturesToAdd.length) {
    addPromises = fixturesToAdd
      .map(
        ({ gameweek, homeTeam, awayTeam, homeGoals, awayGoals, kickoff }) => {
          logMessages.push({
            type: "fixture_added",
            week: gameweek,
            createdAt: now.format(),
            message: `${homeTeam} hosting ${awayTeam} on ${kickoff.toLocaleDateString()}`,
          });
          return prisma.fixture.create({
            data: {
              gameweek,
              homeTeam,
              awayTeam,
              homeGoals,
              awayGoals,
              kickoff,
            },
          });
        }
      )
      ?.filter((x) => !!x);
  }
  if (fixturesToUpdate.length) {
    updatePromises = fixturesToUpdate
      .map(
        ({
          id,
          gameweek,
          homeTeam,
          awayTeam,
          homeGoals,
          awayGoals,
          kickoff,
        }) => {
          logMessages.push({
            type: "fixture_amended",
            fixtureId: id,
            week: gameweek,
            createdAt: now.format(),
            message: `${homeTeam} hosting ${awayTeam} on ${kickoff.toLocaleDateString()}`,
          });
          return prisma.fixture.update({
            where: {
              id,
            },
            data: {
              gameweek,
              homeTeam,
              awayTeam,
              homeGoals,
              awayGoals,
              kickoff,
            },
          });
        }
      )
      ?.filter((x) => !!x);
  }
  if (fixturesToDelete.length) {
    deletePromises = fixturesToDelete
      .map(({ id, gameweek, homeTeam, awayTeam, kickoff }) => {
        logMessages.push({
          type: "fixture_deleted",
          fixtureId: id,
          week: gameweek,
          createdAt: now.format(),
          message: `${homeTeam} hosting ${awayTeam} on ${kickoff}`,
        });
        return prisma.fixture.delete({
          where: {
            id,
          },
        });
      })
      ?.filter((x) => !!x);
  }

  const promises = [...addPromises, ...updatePromises, ...deletePromises];

  if (promises?.length) {
    await Promise.all(promises).then(async () => {
      const logs = logMessages.map((log) => ({
        code: LOG_MESSAGE_TYPE[log.type],
        ...log,
      }));

      try {
        const client = await clientPromise;
        const db = client.db("tbls_db");
        await db.collection("logs").insertMany(logs);
      } catch (error) {
        Sentry.captureException(`Logging failed. ${error}`);
      }
    });
  } else {
    const message = `The populateFixtures serverless function has been run and found no differences between the FPL API and the DB for gameweek ${theGameweek}`;

    try {
      const client = await clientPromise;
      const db = client.db("tbls_db");
      await db
        .collection("logs")
        .insertOne({ type: "populate_fixtures_no_change", message });
    } catch (error) {
      Sentry.captureException(`Logging failed. ${error}`);
    }
  }
};

/*
  Adds or updates fixtures in the database using the FPL fixtures API.

  Params:
   - gameweek: The gameweek in which to update fixtures. Defaults to the current gameweek
   - (optional) numGameweeks: number of gameweeks to update, starting from provided gameweek. Defaults to 1
   - (optional) secret: authenticates caller
   - (optional) persist: Whether to save the fixtures to the DB. Defaults to false
*/
export async function POST(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const secret = searchParams.get("secret");
  const gameweekParam = searchParams.get("gameweek");
  const numGameweeksParam = searchParams.get("numGameweeks");
  const shouldSaveToDatabase = searchParams.get("persist") === "true";

  if (!process.env.ADMIN_EMAIL) {
    return Response.json(
      { message: "Please ensure the ADMIN_EMAIL environment variable is set" },
      { status: 500 }
    );
  }

  if (!process.env.ACTIONS_SECRET)
    return Response.json(
      {
        message: "Please ensure the ACTIONS_SECRET environment variable is set",
      },
      { status: 500 }
    );

  if (secret !== process.env.ACTIONS_SECRET) {
    const session = await getServerSession(authOptions);
    if (session?.user?.email !== process.env.ADMIN_EMAIL) {
      return Response.json(
        { message: "You are not authorised to perform this action" },
        { status: 401 }
      );
    }
  }

  const allDbFixtures = await prisma.fixture.findMany();

  const gameweek =
    getGameweekFromParam(gameweekParam) ||
    calculateCurrentGameweek(allDbFixtures);

  const numGameweeks = getNumGameweeksFromParam(numGameweeksParam);

  const allApiFixtures = await fetchApiData(gameweek, numGameweeks);
  const apiFixturesFlat = sortFixtures(allApiFixtures.flat(1));

  if (!shouldSaveToDatabase) {
    return Response.json({ fixtures: apiFixturesFlat });
  }

  // Synchronously update the fixtures in the requested gameweeks.
  for (let i = gameweek; i <= Math.min(gameweek + numGameweeks - 1, 38); i++) {
    const dbFixtures = allDbFixtures.filter(({ gameweek: week }) => week === i);
    const apiFixtures = allApiFixtures[i - gameweek];

    populateFixtures(i, apiFixtures, dbFixtures);
  }

  return Response.json({ fixtures: apiFixturesFlat });
}
