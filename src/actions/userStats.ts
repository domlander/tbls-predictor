"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "app/api/auth/[...nextauth]/route";
import prisma from "prisma/client";
import calculatePredictionScore from "utils/calculatePredictionScore";

const userStats = async (): Promise<{
  perfectPerc: number;
  correctPerc: number;
  numPredictions: number;
} | null> => {
  const session = await getServerSession(authOptions);
  if (!session?.user.id) {
    return null;
  }

  const user = await prisma.user.findUnique({
    include: {
      predictions: {
        include: {
          fixture: {
            select: {
              homeGoals: true,
              awayGoals: true,
            },
          },
        },
      },
    },
    where: {
      id: session.user.id,
    },
  });

  const predictions = user?.predictions;
  if (!predictions?.length) {
    return null;
  }

  // Don't trust the score in the predictions table
  const predictionsWithScore = predictions
    .map((prediction) => ({
      ...prediction,
      score: calculatePredictionScore(
        [prediction.homeGoals, prediction.awayGoals, prediction.bigBoyBonus],
        [prediction.fixture.homeGoals, prediction.fixture.awayGoals]
      ),
    }))
    .filter(
      ({ fixture }) =>
        typeof fixture.homeGoals === "number" &&
        typeof fixture.awayGoals === "number"
    );

  const correctPredictions = predictionsWithScore.filter(
    ({ score }) => score !== null && score > 0
  ).length;

  const perfectPredictions = predictionsWithScore.filter(
    ({ score }) => score !== null && score >= 3
  ).length;

  const totalPredictions = predictions.length;

  const numPredictions = predictions.length;
  const perfectPerc = (perfectPredictions / totalPredictions) * 100;
  const correctPerc = (correctPredictions / totalPredictions) * 100;

  return { numPredictions, perfectPerc, correctPerc };
};

export default userStats;
