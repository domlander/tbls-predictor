/* eslint-disable camelcase */
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { withSentry } from "@sentry/nextjs";
import dayjs from "dayjs";

import prisma from "prisma/client";
import { getFixturesFromApiForGameweek } from "utils/fplApi";
import Fixture from "src/types/Fixture";
import { calculateCurrentGameweek } from "../../utils/calculateCurrentGameweek";

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

/*
  Fetches the up-to-date results of a match using the FPL API.
  Makes no changes if there is not a live game (kickoff between now and 150 minutes from now)
  If a goal has been scored, calls the updateFixtureResults API to update the
  fixture score and subsequent predictions score for all predictions.
*/
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const secret = req.query.secret as string;
  const session = await getSession({ req });

  if (!process.env.NEXTAUTH_URL)
    return res
      .status(500)
      .send("Please ensure the NEXTAUTH_URL environment variable is set.");

  if (!process.env.ADMIN_EMAIL)
    return res
      .status(500)
      .send("Please ensure the ADMIN_EMAIL environment variable is set.");

  if (!process.env.ACTIONS_SECRET)
    return res
      .status(500)
      .send("Please ensure the ACTIONS_SECRET environment variable is set.");

  if (
    session?.user?.email !== process.env.ADMIN_EMAIL &&
    secret !== process.env.ACTIONS_SECRET
  ) {
    return res
      .status(401)
      .send("You are not authorised to perform this action.");
  }

  const fixtures = await prisma.fixture.findMany();
  const currentGameweek = calculateCurrentGameweek(fixtures);
  const fixturesFromDb = fixtures.filter(
    ({ gameweek }) => gameweek === currentGameweek
  );

  const liveFixtures = fixturesFromDb.filter(({ kickoff }) =>
    isGameLiveOrRecentlyFinished(kickoff)
  );
  if (!liveFixtures?.length) {
    return res.status(200).send("No live games found");
  }

  const fixturesFromApi = await getFixturesFromApiForGameweek(currentGameweek);

  const fixturesToUpdate = liveFixtures.reduce((acc, fixture) => {
    const matchingFixtureFromApi = fixturesFromApi.find(
      // If two teams playing against each other twice in a gameweek becomes a thing, we can compare on the day as well
      (x) => x.homeTeam === fixture.homeTeam && x.awayTeam === fixture.awayTeam
    );
    if (!matchingFixtureFromApi) {
      return acc;
    }

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
    }

    return acc;
  }, [] as Fixture[]);

  if (!fixturesToUpdate?.length) {
    return res
      .status(200)
      .json("No recent goals have been scored. No scores to update.");
  }

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
  );

  return res.status(200).json({ fixtures: fixturesToUpdate });
};

export default withSentry(handler);
