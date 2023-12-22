"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "pages/api/auth/[...nextauth]";
import prisma from "prisma/client";

const createLeague = async (
  _: { message: string },
  formData: FormData
): Promise<{ message: string }> => {
  const name = formData.get("name") as string;
  const start = parseInt(formData.get("start") as string);
  const weeksToRun = parseInt(formData.get("weeksToRun") as string);
  const userId = formData.get("userId") as string;

  if (!name.length) {
    return {
      message: "Please enter a league name",
    };
  }

  if (start < 1 || start > 38) {
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

  try {
    const league = await prisma.league.create({
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
    return {
      message: `Success! League "${name}" was created! Ask friends to join using ID: ${league.id}`,
    };
  } catch (e) {
    return { message: "Failed to create league. Please try again later" };
  }
};

export default createLeague;
