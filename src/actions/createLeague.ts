"use server";

import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "app/api/auth/[...nextauth]/route";
import prisma from "prisma/client";

const createLeague = async (
  _: { message: string } | null,
  formData: FormData
): Promise<{ message: string }> => {
  const name = formData.get("name") as string;
  const start = parseInt(formData.get("start") as string);
  const weeksToRun = parseInt(formData.get("weeksToRun") as string);
  const userId = formData.get("userId") as string;
  const currentGameweek = parseInt(formData.get("currentGameweek") as string);

  if (!name.length) {
    return {
      message: "Please enter a league name",
    };
  }

  if (start <= currentGameweek || start > 38) {
    return {
      message: "Enter a future gameweek in which to begin the league",
    };
  }

  const gameweekEnd = start + weeksToRun - 1;
  if (gameweekEnd < start || gameweekEnd > 38) {
    return { message: "Invalid value for weeks to run" };
  }

  const session = await getServerSession(authOptions);
  if (!session) {
    return { message: "An error has occured" };
  }

  let league;
  try {
    league = await prisma.league.create({
      data: {
        name,
        status: "open",
        administratorId: userId,
        season: "2023/2024", // TODO
        gameweekStart: start,
        gameweekEnd: Math.min(gameweekEnd, 38),
        users: {
          connect: {
            id: userId,
          },
        },
      },
    });
  } catch (e) {
    return { message: "Failed to create league. Please try again later" };
  }

  return redirect(`/league/${league.id}/admin`);
};

export default createLeague;
