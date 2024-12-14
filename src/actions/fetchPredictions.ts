"use server";

import { auth } from "auth";

import prisma from "prisma/client";
import calculatePredictionScore from "utils/calculatePredictionScore";
import Prediction from "src/types/Prediction";

const fetchPredictions = async (
  weekId: number
): Promise<{
  predictions: Prediction[];
}> => {
  const session = await auth();
  if (!session?.user.id) {
    // TODO: Can we redirect to sign in here?
    return { predictions: [] };
  }

  /**
   * Find all fixtures for the gameweek
   */
  const fixtures = await prisma.fixture.findMany({
    where: {
      gameweek: weekId,
    },
    include: {
      predictions: {
        where: {
          userId: session.user.id,
        },
      },
    },
  });

  const predictions = fixtures.map((fixture) => {
    const prediction = fixture.predictions[0] || {
      homeGoals: null,
      awayGoals: null,
      bigBoyBonus: false,
    };

    return {
      user: { id: session.user.id },
      fixtureId: fixture.id,
      homeGoals: prediction.homeGoals,
      awayGoals: prediction.awayGoals,
      bigBoyBonus: prediction.bigBoyBonus,
      score: calculatePredictionScore(
        [prediction.homeGoals, prediction.awayGoals, prediction.bigBoyBonus],
        [fixture.homeGoals, fixture.awayGoals]
      ),
    };
  });

  return { predictions };
};

export default fetchPredictions;
