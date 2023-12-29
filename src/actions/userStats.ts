"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";
import prisma from "prisma/client";

const userStats = async (): Promise<{
  perfectPerc: number | null;
  correctPerc: number | null;
}> => {
  const session = await getServerSession(authOptions);
  if (!session?.user.id) {
    return { perfectPerc: null, correctPerc: null };
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
  if (!predictions?.length) {
    return { perfectPerc: null, correctPerc: null };
  }

  const correctPredictions = predictions.filter(
    ({ score }) => score !== null && score > 0
  ).length;
  const perfectPredictions = predictions.filter(
    ({ score }) => score !== null && score >= 3
  ).length;
  const totalPredictions = predictions.length;

  const perfectPerc = (perfectPredictions / totalPredictions) * 100;
  const correctPerc = (correctPredictions / totalPredictions) * 100;

  return { perfectPerc, correctPerc };
};

export default userStats;
