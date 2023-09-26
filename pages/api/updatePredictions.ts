import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import * as Sentry from "@sentry/nextjs";

import { UpdatePredictionsInputType } from "src/containers/Predictions/Predictions";
import isPastDeadline from "utils/isPastDeadline";

type RequestBody = {
  predictions: UpdatePredictionsInputType[];
};

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed.");
  }

  const { predictions }: RequestBody = JSON.parse(req.body);

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
    return res.status(500).end();
  }

  return res.status(200).end();
};

export default handler;
