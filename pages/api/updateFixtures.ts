import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

import Fixture from "src/types/Fixture";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../app/api/auth/[...nextauth]/route";

type RequestBody = {
  fixtures: Fixture[];
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

  const session = await getServerSession(req, res, authOptions);
  if (session?.user.email !== process.env.ADMIN_EMAIL) {
    return res
      .status(401)
      .json("You are not authorized to perform this action.");
  }

  const { fixtures }: RequestBody = JSON.parse(req.body);
  if (!fixtures?.length) return res.status(200).end();

  const fixtureUpdates = fixtures.map(({ id, homeTeam, awayTeam }) => {
    // eslint-disable-next-line consistent-return
    return prisma.fixture.update({
      where: {
        id,
      },
      data: {
        homeTeam,
        awayTeam,
      },
    });
  });

  await Promise.all(fixtureUpdates);

  return res.status(200).end();
};

export default handler;
