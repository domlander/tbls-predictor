/* eslint-disable camelcase */
import { NextApiRequest, NextApiResponse } from "next";
import { withSentry } from "@sentry/nextjs";
import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/react";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

/*
  Get users correct % and perfect %
*/
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(500);
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
        where: {
          score: {
            not: null,
          },
        },
      },
    },
    where: {
      id: session.user.id,
    },
  });

  const predictions = user?.predictions;

  let correctPerc = null;
  let perfectPerc = null;
  if (predictions?.length) {
    const correctPredictions = predictions.filter(
      ({ score }) => score !== null && score > 0
    ).length;
    const perfectPredictions = predictions.filter(
      ({ score }) => score !== null && score >= 3
    ).length;
    const totalPredictions = predictions.length;

    perfectPerc = (perfectPredictions / totalPredictions) * 100;
    correctPerc = (correctPredictions / totalPredictions) * 100;
  }

  return res.status(200).json({ perfectPerc, correctPerc });
};

export default withSentry(handler);
