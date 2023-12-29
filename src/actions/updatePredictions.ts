"use server";

import * as Sentry from "@sentry/nextjs";
import prisma from "prisma/client";
import { UpdatePredictionsInputType } from "src/containers/Predictions/Predictions";
import isPastDeadline from "utils/isPastDeadline";

const updatePredictions = async (
  predictions: UpdatePredictionsInputType[]
): Promise<{ success: boolean }> => {
  if (!predictions?.length) return { success: false };

  const fixtures = await prisma.fixture.findMany({
    select: {
      id: true,
      kickoff: true,
    },
    where: {
      id: {
        in: predictions.map(({ fixtureId }) => fixtureId),
      },
    },
  });

  const updateableFixtures = fixtures
    .filter(({ kickoff }) => !isPastDeadline(kickoff))
    .map(({ id }) => id);

  try {
    const predictionsUpsert = predictions.map(
      ({ userId, fixtureId, homeGoals, awayGoals, bigBoyBonus }) => {
        // Don't let the user submit predictions after the match has finished! We cannot trust the client
        if (!updateableFixtures.includes(fixtureId)) return;

        const data = {
          userId,
          fixtureId,
          homeGoals,
          awayGoals,
          bigBoyBonus,
        };

        // eslint-disable-next-line consistent-return
        return prisma.prediction.upsert({
          where: {
            fixtureId_userId: { fixtureId, userId },
          },
          create: data,
          update: data,
        });
      }
    );

    await Promise.all(predictionsUpsert);
  } catch (e) {
    Sentry.captureException(e);
    return { success: false };
  }

  return { success: true };
};

export default updatePredictions;
