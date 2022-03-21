/* eslint-disable camelcase */
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { withSentry } from "@sentry/nextjs";
import prisma from "prisma/client";
import { Prediction, Prisma } from "@prisma/client";

const DEFAULT_HOME_GOALS = 0;
const DEFAULT_AWAY_GOALS = 0;

/**
 * The number of minutes after kickoff is an estimation of when the game will roughly finish.
 * As long as this is greater than the frequency that this API is called, then this API
 * will not miss any fixtures.
 */
const isGameLive = (kickoff: Date) => {
  const now = new Date();
  const timeIn110Minutes = new Date();
  timeIn110Minutes.setMinutes(timeIn110Minutes.getMinutes() + 110);

  return kickoff > now && kickoff < timeIn110Minutes;
};

/**
 * Adds missing predictions for live matches.
 * When a game starts, if there are any users who haven't entered a prediction,
 * give them the default prediction of 0-0 for the game and add to database.
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const secret = req.query.secret as string;
  const session = await getSession({ req });

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

  const allFixtures = await prisma.fixture.findMany({});
  const fixtures = allFixtures.filter(({ kickoff }) => isGameLive(kickoff));

  if (!fixtures?.length) {
    return res.status(200).send("No fixtures found");
  }

  fixtures.forEach((fixture) => {
    addMissingPredictionsForFixture(fixture.id);
  });

  return res.send(200);
};

const addMissingPredictionsForFixture = async (fixtureId: number) => {
  const results: Prisma.Prisma__PredictionClient<Prediction>[] = [];
  const users = await prisma.user.findMany({
    select: {
      id: true,
      predictions: {
        where: {
          fixtureId,
        },
      },
    },
  });

  const usersWithoutPrediction = users.filter(
    (user) => !user.predictions.length
  );

  usersWithoutPrediction.forEach((user) => {
    const dbUpdate = prisma.prediction.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        fixture: {
          connect: {
            id: fixtureId,
          },
        },
        homeGoals: DEFAULT_HOME_GOALS,
        awayGoals: DEFAULT_AWAY_GOALS,
        bigBoyBonus: false,
      },
    });

    results.push(dbUpdate);
  });

  await Promise.all(results);
};

export default withSentry(handler);
