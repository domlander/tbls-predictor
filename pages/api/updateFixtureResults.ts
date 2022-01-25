/* eslint-disable camelcase */
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { withSentry } from "@sentry/nextjs";
import prisma from "prisma/client";

import { Prediction, Prisma } from "@prisma/client";
import calculatePredictionScore from "../../utils/calculatePredictionScore";

/*
  Updates the score of a Premier League match. Evaluates the score of all predictions for this fixtures.

  Params:
  - scores: An array of objects containing the following fields: fixtureId, homeScore, awayScore
*/
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (session?.user?.email !== process.env.ADMIN_EMAIL) {
    res.status(401).send("You are not authorised to perform this action.");
    return;
  }

  const scores = (req.body.scores as Prediction[]) || [];
  if (!scores?.length) {
    res.status(400).send("No scores found.");
    return;
  }

  scores.forEach(({ fixtureId, homeGoals, awayGoals }) => {
    updateFixtureScoreAndEvaluatePredictions(fixtureId, homeGoals, awayGoals);
  });

  res.send(200);
};

const updateFixtureScoreAndEvaluatePredictions = async (
  fixtureId: number,
  homeGoals: number | null,
  awayGoals: number | null
) => {
  // Be sure to update the fixture table with the score before updating prediction evaluations.
  await updateFixtureScore(fixtureId, homeGoals, awayGoals);
  await evaluatePredictions(fixtureId, homeGoals, awayGoals);
};

const updateFixtureScore = async (
  id: number,
  homeGoals: number | null,
  awayGoals: number | null
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

const evaluatePredictions = async (
  fixtureId: number,
  homeGoals: number | null,
  awayGoals: number | null
) => {
  if (homeGoals === null || awayGoals === null) return;

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
