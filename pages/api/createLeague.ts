import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { withSentry } from "@sentry/nextjs";
import { PrismaClient } from "@prisma/client";

import { calculateCurrentGameweek } from "utils/calculateCurrentGameweek";
import { authOptions } from "./auth/[...nextauth]";

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
  if (!session) {
    return res.status(500).end();
  }

  const userId = session.user.id;

  const { name } = req.body;
  const gameweekStart = parseInt(req.body.gameweekStart);
  const gameweekEnd = parseInt(req.body.gameweekEnd);

  if (gameweekStart < 1 || gameweekStart > 38)
    return res.status(500).json("Gameweek start week is not valid");

  if (gameweekEnd < 1)
    return res.status(500).json("Gameweek end week is not valid");

  if (gameweekStart > gameweekEnd)
    return res
      .status(500)
      .json("The final gameweek must be the same or after the first.");

  // Cannot start in a past gameweek
  const fixtures = await prisma.fixture.findMany({
    select: {
      id: true,
      gameweek: true,
      kickoff: true,
    },
  });

  const currentGameweek = calculateCurrentGameweek(fixtures);
  if (gameweekStart <= currentGameweek)
    return res
      .status(500)
      .json("Enter a future gameweek in which to begin the league.");

  const league = await prisma.league.create({
    data: {
      name,
      status: "open",
      administratorId: userId,
      season: "2023/2024", // TODO
      gameweekStart,
      gameweekEnd: Math.min(gameweekEnd, 38),
      users: {
        connect: {
          id: userId,
        },
      },
    },
  });

  return res
    .status(200)
    .json(
      `Success! League "${name}" was created! Ask friends to join using ID: ${league.id}`
    );
};

export default withSentry(handler);
