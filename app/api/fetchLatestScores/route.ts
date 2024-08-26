/* eslint-disable camelcase */
import { getServerSession } from "next-auth/next";
import dayjs from "dayjs";
import { PrismaClient } from "@prisma/client";
import { getFixturesFromApi } from "utils/fplApi";
import Fixture from "src/types/Fixture";
import { calculateCurrentGameweek } from "../../../utils/calculateCurrentGameweek";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextRequest } from "next/server";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

/**
 * Returns true if the match has started at maximum 180 minutes ago.
 * Matches typically finish 110-120 mins after kickoff.
 */
export const isGameLiveOrRecentlyFinished = (kickoff: Date): boolean => {
  const now = dayjs();
  const kickoffPlus180Minutes = dayjs(kickoff).add(180, "minute");

  return now > dayjs(kickoff) && now < kickoffPlus180Minutes;
};

const isInvokedByGithubAction = (secret: string | null, gaSecret: string) => {
  return secret === gaSecret;
};

/*
  Fetches the up-to-date results of a live or recently finished 
  fixture in the current gameweek using the FPL API.

  Makes NO changes if there is not a live (or recently finished) game.

  If a goal has been scored, calls the updateFixtureResults API to update the
  fixture score and subsequent predictions score for all predictions.
*/
export async function POST(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const secret = searchParams.get("secret");
  const startTime = new Date();

  if (!process.env.NEXTAUTH_URL)
    return Response.json(
      { message: "Please ensure the NEXTAUTH_URL environment variable is set" },
      { status: 500 }
    );

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

  if (!isInvokedByGithubAction(secret, process.env.ACTIONS_SECRET)) {
    const session = await getServerSession(authOptions);
    if (session?.user?.email !== process.env.ADMIN_EMAIL) {
      return Response.json(
        { message: "You are not authorised to perform this action" },
        { status: 401 }
      );
    }
  }

  let log = `Running fetchLatestScores function. User authenticated. Time: ${
    new Date().getMilliseconds() - startTime.getMilliseconds()
  }\n`;

  const fixtures = await prisma.fixture.findMany();
  const currentGameweek = calculateCurrentGameweek(fixtures);
  const fixturesFromDb = fixtures.filter(
    ({ gameweek }) => gameweek === currentGameweek
  );

  log += `Current Gameweek: ${currentGameweek}\n`;
  log += `fixturesFromDb: ${JSON.stringify(fixturesFromDb)}\n`;

  const liveFixtures = fixturesFromDb.filter(({ kickoff }) =>
    isGameLiveOrRecentlyFinished(kickoff)
  );
  if (!liveFixtures?.length) {
    log += "No live games found\n";
    return new Response(log);
  }

  log += `liveFixtures\n: 
  ${liveFixtures.forEach(({ homeTeam, awayTeam }) => {
    log += `fixture: ${homeTeam} - ${awayTeam}\n`;
  })}`;

  const freshFixtureData = await getFixturesFromApi(currentGameweek);

  const fixturesToUpdate = liveFixtures.reduce((acc, fixture) => {
    const matchingFixture = freshFixtureData.find(
      // If two teams playing against each other twice in a gameweek becomes a thing, we can compare on the day as well
      ({ homeTeam, awayTeam }) =>
        homeTeam === fixture.homeTeam && awayTeam === fixture.awayTeam
    );
    if (!matchingFixture) return acc;

    log += `Checking ${matchingFixture.homeTeam} vs ${matchingFixture.awayTeam} fixture\n`;

    if (
      fixture.homeGoals !== matchingFixture.homeGoals ||
      fixture.awayGoals !== matchingFixture.awayGoals ||
      fixture.isFinished !== matchingFixture.isFinished
    ) {
      acc.push({
        ...fixture,
        homeGoals: matchingFixture?.homeGoals ?? null,
        awayGoals: matchingFixture?.awayGoals ?? null,
      });

      log += `New data: ${matchingFixture?.homeGoals} - ${
        matchingFixture?.awayGoals
      }${matchingFixture.isFinished ? " FT" : ""}\n`;
    }

    return acc;
  }, [] as Fixture[]);

  if (!fixturesToUpdate?.length) {
    log += "No goals have been scored. No fixtures to update\n";
    return new Response(log);
  }

  fixturesToUpdate.forEach(({ id, homeGoals, awayGoals }) => {
    log += `Fixture ID: ${id}. Score update! Updating score to ${homeGoals} - ${awayGoals}\n`;
  });

  fetch(
    `${process.env.NEXTAUTH_URL}/api/updateFixtureResults?secret=${process.env.ACTIONS_SECRET}`,
    {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ scores: fixturesToUpdate }),
    }
  ).catch((e) => {
    log += `An error occurred: ${e}\n`;
  });

  return Response.json({ fixtures: fixturesToUpdate, log });
}
