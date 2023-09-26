import { NextApiRequest, NextApiResponse } from "next";
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
  Get users predictions
*/
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { weekId } = req.query;
  if (
    typeof weekId !== "string" ||
    parseInt(weekId) < 1 ||
    parseInt(weekId) > 38
  ) {
    return res.status(400).end();
  }

  const session = await getSession({ req });
  if (!session?.user.id) {
    return res.status(500).end();
  }

  const predictions = await prisma.prediction.findMany({
    where: {
      AND: [
        { userId: session.user.id },
        {
          fixture: {
            gameweek: parseInt(weekId),
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

  return res.status(200).json({ predictions });
};

export default handler;
