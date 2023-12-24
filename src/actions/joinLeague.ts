"use server";

import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "app/api/auth/[...nextauth]/route";
import prisma from "prisma/client";
import { isUserAlreadyBelongToLeague } from "utils/isUserAlreadyBelongToLeague";
import isUserAppliedToLeague from "utils/isUserAppliedToLeague";

const joinLeague = async (
  _: { message: string } | null,
  formData: FormData
): Promise<{ message: string }> => {
  const leagueId = parseInt(formData.get("id") as string);

  const session = await getServerSession(authOptions);
  const userId = session?.user.id;
  if (!userId) {
    return { message: "Please log in to join a league" };
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
    return {
      message:
        "League not found. Please ensure you have the correct League ID.",
    };

  if (isUserAlreadyBelongToLeague(league.users, userId))
    return {
      message: "You are already a member of this league.",
    };

  if (isUserAppliedToLeague(league.applicants, userId))
    return {
      message:
        "You already have an application to join this league. Please ask the league admin to accept you in to the league.",
    };

  try {
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
  } catch (e) {
    return { message: "Failed to create league. Please try again later" };
  }

  return redirect(`/league/${league.id}`);
};

export default joinLeague;
