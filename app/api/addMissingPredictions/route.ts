/* eslint-disable camelcase */
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { Prediction, Prisma, PrismaClient } from "@prisma/client";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

const DEFAULT_HOME_GOALS = 0;
const DEFAULT_AWAY_GOALS = 0;

/**
 * The number of minutes after kickoff is an estimation of when the game will roughly finish.
 * As long as this is greater than the frequency that this API is called, then this API
 * will not miss any fixtures.
 */
const isGameLive = (kickoff: Date) => {
  const now = new Date();
  const timeIn110Minutes = new Date();
  timeIn110Minutes.setMinutes(timeIn110Minutes.getMinutes() + 110);

  return kickoff > now && kickoff < timeIn110Minutes;
};

const addMissingPredictionsForFixture = async (fixtureId: number) => {
  const results: Prisma.Prisma__PredictionClient<Prediction>[] = [];
  const users = await prisma.user.findMany({
    select: {
      id: true,
      predictions: {
        where: {
          fixtureId,
        },
      },
    },
  });

  const usersWithoutPrediction = users.filter(
    (user) => !user.predictions.length
  );

  usersWithoutPrediction.forEach((user) => {
    const dbUpdate = prisma.prediction.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        fixture: {
          connect: {
            id: fixtureId,
          },
        },
        homeGoals: DEFAULT_HOME_GOALS,
        awayGoals: DEFAULT_AWAY_GOALS,
        bigBoyBonus: false,
      },
    });

    results.push(dbUpdate);
  });

  await Promise.all(results);
};

/**
 * Adds missing predictions for live matches.
 * When a game starts, if there are any users who haven't entered a prediction,
 * give them the default prediction of 0-0 for the game and add to database.
 */
export async function POST(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const secret = searchParams.get("secret");

  if (!process.env.ADMIN_EMAIL) {
    return Response.json(
      { message: "Please ensure the ADMIN_EMAIL environment variable is set" },
      { status: 500 }
    );
  }

  if (!process.env.ACTIONS_SECRET)
    return Response.json(
      {
        message: "Please ensure the ACTIONS_SECRET environment variable is set",
      },
      { status: 500 }
    );

  if (secret !== process.env.ACTIONS_SECRET) {
    const session = await getServerSession(authOptions);
    if (session?.user?.email !== process.env.ADMIN_EMAIL) {
      return Response.json(
        { message: "You are not authorised to perform this action" },
        { status: 401 }
      );
    }
  }

  const allFixtures = await prisma.fixture.findMany({});
  const fixtures = allFixtures.filter(({ kickoff }) => isGameLive(kickoff));

  if (!fixtures?.length) {
    return Response.json({ message: "No fixtures found" }, { status: 500 });
  }

  fixtures.forEach((fixture) => {
    addMissingPredictionsForFixture(fixture.id);
  });

  return new Response("Success!");
}
