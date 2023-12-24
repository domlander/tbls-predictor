import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { PrismaClient } from "@prisma/client";

import { isUserAlreadyBelongToLeague } from "utils/isUserAlreadyBelongToLeague";
import isUserAppliedToLeague from "utils/isUserAppliedToLeague";
import { authOptions } from "../../app/api/auth/[...nextauth]/route";

type RequestBody = {
  leagueId: string;
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
  if (!session) {
    return res.status(500).end();
  }

  const userId = session.user.id;
  const { leagueId: leagueIdFromRequest }: RequestBody = req.body;
  const leagueId = parseInt(leagueIdFromRequest);

  if (leagueId < 1) {
    return res.status(500).json("League ID not valid.");
  }

  const league = await prisma.league.findUnique({
    where: {
      id: leagueId,
    },
    include: {
      users: true,
      applicants: true,
    },
  });

  if (!league)
    return res
      .status(500)
      .json("League not found. Please ensure you have the correct League ID.");

  if (isUserAlreadyBelongToLeague(league.users, userId))
    return res.status(500).json("You are already a member of this league.");

  if (isUserAppliedToLeague(league.applicants, userId))
    return res
      .status(500)
      .json(
        "You already have an application to join this league. Please ask the league admin to accept you in to the league."
      );

  await prisma.applicant.upsert({
    where: {
      userId_leagueId: { userId, leagueId },
    },
    create: {
      userId,
      leagueId,
      status: "applied",
    },
    update: {
      status: "applied",
    },
  });

  return res
    .status(200)
    .json("Success! Ask the league admin to accept your application!");
};

export default handler;
