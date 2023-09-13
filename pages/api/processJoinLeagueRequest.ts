import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { withSentry } from "@sentry/nextjs";
import { PrismaClient } from "@prisma/client";

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

  const { applicantId } = req.body;
  const leagueId = parseInt(req.body.leagueId);
  const isAccepted = req.body.isAccepted === "true";

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
      .json("Cannot process request. League not found. Try again later.");

  if (session.user.id !== league.administratorId)
    return res
      .status(500)
      .json(
        "Cannot process request. Current user is not an administrator of this league."
      );

  if (
    !league.applicants.some(
      (applicant) =>
        applicant.userId === applicantId && applicant.status === "applied"
    )
  ) {
    return res
      .status(500)
      .json(
        "Cannot process request. Trying to accept a user in to the league that is not an applicant."
      );
  }

  if (isAccepted) {
    // Add user to the league and update their application status
    await prisma.league.update({
      where: {
        id: leagueId,
      },
      data: {
        users: {
          connect: {
            id: applicantId,
          },
        },
        applicants: {
          update: {
            where: {
              userId_leagueId: { userId: applicantId, leagueId },
            },
            data: {
              status: "accepted",
            },
          },
        },
      },
    });
  } else {
    // Reject league join application
    await prisma.applicant.update({
      where: {
        userId_leagueId: { userId: applicantId, leagueId },
      },
      data: {
        status: "rejected",
      },
    });
  }

  const message = isAccepted
    ? "Successfully added user to the league!"
    : "Rejected user's application";

  return res.status(200).json(message);
};

export default withSentry(handler);
