"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "app/api/auth/[...nextauth]/route";
import prisma from "prisma/client";

const processJoinLeagueRequest = async (
  leagueId: number,
  applicantId: string,
  isAccepted: boolean
): Promise<{ message: string }> => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { message: "An error has occured" };
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

  if (!league) {
    return {
      message: "Cannot process request. League not found. Try again later.",
    };
  }

  if (session.user.id !== league.administratorId) {
    return {
      message:
        "Cannot process request. Current user is not an administrator of this league.",
    };
  }

  if (
    !league.applicants.some(
      (applicant) =>
        applicant.userId === applicantId && applicant.status === "applied"
    )
  ) {
    return {
      message:
        "Cannot process request. Trying to accept a user in to the league that is not an applicant.",
    };
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

  return {
    message: isAccepted
      ? "Successfully added user to the league!"
      : "Rejected user's application",
  };
};

export default processJoinLeagueRequest;
