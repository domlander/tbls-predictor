/* eslint-disable camelcase */
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { withSentry } from "@sentry/nextjs";
import { Fixture, Prediction, Prisma, PrismaClient } from "@prisma/client";
import calculatePredictionScore from "../../utils/calculatePredictionScore";
import { authOptions } from "./auth/[...nextauth]";

type RequestBody = {
  scores: Fixture[];
};

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

/**
 * Updates the score of a match and evaluates the score of all predictions for this fixtures.
 *
 * Params:
 *   - req.scores: An array of objects containing the following fields: id, homeGoals, awayGoals
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const secret = req.query.secret as string;
  const session = await getServerSession(req, res, authOptions);

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

  const { scores }: RequestBody = req.body.scores || [];

  if (!scores?.length) {
    return res.status(400).send("No scores found.");
  }

  scores.forEach(({ id, homeGoals, awayGoals }) => {
    updateFixtureScoreAndEvaluatePredictions(id, homeGoals, awayGoals);
  });

  return res.status(200).json({ scores });
};

const updateFixtureScoreAndEvaluatePredictions = async (
  fixtureId: number,
  homeGoals?: number | null,
  awayGoals?: number | null
) => {
  if (typeof homeGoals !== "number" || typeof awayGoals !== "number") {
    return;
  }

  // Update the fixture table score BEFORE updating prediction scores.
  await updateFixtureScore(fixtureId, homeGoals, awayGoals);
  await findAllPredictionsAndUpdateScore(fixtureId, homeGoals, awayGoals);
};

const updateFixtureScore = async (
  id: number,
  homeGoals: number,
  awayGoals: number
) => {
  await prisma.fixture.update({
    where: {
      id,
    },
    data: {
      homeGoals,
      awayGoals,
    },
  });
};

/**
 * Finds all predictions for the given fixture and updates the score for each prediction.
 */
const findAllPredictionsAndUpdateScore = async (
  fixtureId: number,
  homeGoals: number,
  awayGoals: number
) => {
  const predictions = await prisma.prediction.findMany({
    where: {
      fixtureId,
    },
  });
  if (!predictions?.length) return;

  // Synchronously make the database updates to the prediction table: In time there may be a lot of them
  const results: Prisma.Prisma__PredictionClient<Prediction>[] = [];
  predictions.forEach(
    ({
      userId,
      homeGoals: predictedHomeGoals,
      awayGoals: predictedAwayGoals,
      bigBoyBonus,
    }) => {
      const predictedResult: [number, number, boolean] = [
        predictedHomeGoals || 0,
        predictedAwayGoals || 0,
        bigBoyBonus,
      ];
      const actualResult: [number, number] = [homeGoals, awayGoals];
      const score = calculatePredictionScore(predictedResult, actualResult);

      const dbUpdate = prisma.prediction.update({
        where: {
          fixtureId_userId: {
            fixtureId,
            userId,
          },
        },
        data: {
          score,
        },
      });

      results.push(dbUpdate);
    }
  );

  await Promise.all(results);
};

export default withSentry(handler);
