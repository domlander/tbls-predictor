import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { PrismaClient } from "@prisma/client";

import sortFixtures from "utils/sortFixtures";
import Fixture from "src/types/Fixture";
import { authOptions } from "./auth/[...nextauth]";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

type RequestBody = {
  gameweek: number;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);

  if (!process.env.ADMIN_EMAIL)
    return res
      .status(500)
      .send("Please ensure the ADMIN_EMAIL environment variable is set.");

  if (!process.env.ACTIONS_SECRET)
    return res
      .status(500)
      .send("Please ensure the ACTIONS_SECRET environment variable is set.");

  if (session?.user?.email !== process.env.ADMIN_EMAIL) {
    return res
      .status(401)
      .send("You are not authorised to perform this action.");
  }

  const { gameweek }: RequestBody = JSON.parse(req.body);
  if (!gameweek) {
    return res.status(400).send("Please provide a gameweek.");
  }

  const fixtures = await prisma.fixture.findMany({
    where: {
      gameweek,
    },
  });

  const sortedFixtures: Fixture[] = sortFixtures(fixtures);

  return res.status(200).json({ fixtures: sortedFixtures });
};

export default handler;
