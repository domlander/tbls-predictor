/* eslint-disable camelcase */
import { getServerSession } from "next-auth/next";
import dayjs from "dayjs";
import { PrismaClient } from "@prisma/client";
import { getFixturesFromApiForGameweek } from "utils/fplApi";
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

const hasScoreChanged = (
  oldScore: [number | null, number | null],
  newScore: [number | null, number | null]
) => oldScore[0] !== newScore[0] || oldScore[1] !== newScore[1];

/**
 * Returns true if the match has started at maximum 150 minutes ago.
 * Matches usually finish after 110-120 mins after kickoff, so there is a little extra
 * time given, in case of injuries.
 */
export const isGameLiveOrRecentlyFinished = (kickoff: Date): boolean => {
  const now = dayjs();
  const kickoffPlus150Minutes = dayjs(kickoff).add(150, "minute");

  return now > dayjs(kickoff) && now < kickoffPlus150Minutes;
};

const isInvokedByGithubAction = (secret: string | null, gaSecret: string) => {
  return secret === gaSecret;
};

/*
  Fetches the up-to-date results of a live or recently finished 
  fixture in the current gameweek using the FPL API.

  Makes NO changes if there is not a live game (kickoff between now and 150 minutes from now)
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

  const fixturesFromApi = await getFixturesFromApiForGameweek(currentGameweek);

  const fixturesToUpdate = liveFixtures.reduce((acc, fixture) => {
    const matchingFixtureFromApi = fixturesFromApi.find(
      // If two teams playing against each other twice in a gameweek becomes a thing, we can compare on the day as well
      ({ homeTeam, awayTeam }) =>
        homeTeam === fixture.homeTeam && awayTeam === fixture.awayTeam
    );
    if (!matchingFixtureFromApi) return acc;

    log += `Checking ${matchingFixtureFromApi.homeTeam} vs ${matchingFixtureFromApi.awayTeam} fixture\n`;

    if (
      hasScoreChanged(
        [fixture.homeGoals, fixture.awayGoals],
        [matchingFixtureFromApi.homeGoals, matchingFixtureFromApi.awayGoals]
      )
    ) {
      acc.push({
        ...fixture,
        homeGoals: matchingFixtureFromApi?.homeGoals ?? null,
        awayGoals: matchingFixtureFromApi?.awayGoals ?? null,
      });

      log += `Will update score to ${matchingFixtureFromApi?.homeGoals} - ${matchingFixtureFromApi?.awayGoals}\n`;
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
