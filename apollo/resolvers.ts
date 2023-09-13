import prisma from "prisma/client";
import * as Sentry from "@sentry/nextjs";

import isPastDeadline from "utils/isPastDeadline";
import dateScalar from "./scalars";

const resolvers = {
  Mutation: {
    updatePredictions: async (_, { input: predictions }) => {
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
        return null;
      }

      return {
        predictions: predictions.map(
          ({
            userId,
            fixtureId,
            homeGoals,
            awayGoals,
            score,
            bigBoyBonus,
          }) => ({
            fixtureId,
            homeGoals,
            awayGoals,
            score,
            bigBoyBonus,
            user: {
              id: userId,
            },
          })
        ),
      };
    },
  },
  DateTime: dateScalar,
};

export default resolvers;
