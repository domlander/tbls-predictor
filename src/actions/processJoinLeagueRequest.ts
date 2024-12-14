"use server";

import { auth } from "auth";

import prisma from "prisma/client";
import { revalidatePath } from "next/cache";

const processJoinLeagueRequest = async (
  leagueId: number,
  applicantId: string,
  isAccepted: boolean
): Promise<{ message: string }> => {
  const session = await auth();
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

    revalidatePath(`league/${leagueId}/admin`, "page");
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
