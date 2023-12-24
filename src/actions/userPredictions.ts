"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "app/api/auth/[...nextauth]/route";
import prisma from "prisma/client";
import Prediction from "src/types/Prediction";

const userPredictions = async (
  weekId: number
): Promise<Prediction[] | null> => {
  if (weekId < 1 || weekId > 38) {
    return null;
  }

  const session = await getServerSession(authOptions);
  if (!session?.user.id) {
    return null;
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
    },
  });

  return predictions;
};

export default userPredictions;
