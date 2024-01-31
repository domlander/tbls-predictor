"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "app/api/auth/[...nextauth]/route";
import prisma from "prisma/client";
import calculatePredictionScore from "utils/calculatePredictionScore";
import Prediction from "src/types/Prediction";

const fetchPredictions = async (
  weekId: number
): Promise<{
  predictions: Prediction[];
}> => {
  const session = await getServerSession(authOptions);
  if (!session?.user.id) {
    // TODO: Can we redirect to sign in here?
    return { predictions: [] };
  }

  const predictions = await prisma.prediction.findMany({
    where: {
      AND: [
        { userId: session.user.id },
        {
          fixture: {
            gameweek: weekId,
          },
        },
      ],
    },
    include: {
      user: {
        select: {
          id: true,
        },
      },
      fixture: {
        select: {
          homeGoals: true,
          awayGoals: true,
        },
      },
    },
  });

  // Don't trust the score in the predictions table
  const predictionsWithScore = predictions.map((prediction) => ({
    ...prediction,
    score: calculatePredictionScore(
      [prediction.homeGoals, prediction.awayGoals, prediction.bigBoyBonus],
      [prediction.fixture.homeGoals, prediction.fixture.awayGoals]
    ),
  }));

  return { predictions: predictionsWithScore };
};

export default fetchPredictions;
