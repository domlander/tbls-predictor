import { auth } from "auth";
import * as Sentry from "@sentry/nextjs";
import { Fixture, Prediction, Prisma, PrismaClient } from "@prisma/client";
import calculatePredictionScore from "../../../utils/calculatePredictionScore";

import { NextRequest } from "next/server";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

/**
 * Updates the score of a match and evaluates the score of all predictions for this fixtures.
 *
 * Params:
 *   - req.scores: An array of objects containing the following fields: id, homeGoals, awayGoals
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
    const session = await auth();
    if (session?.user?.email !== process.env.ADMIN_EMAIL) {
      return Response.json(
        { message: "You are not authorised to perform this action" },
        { status: 401 }
      );
    }
  }

  const { scores }: { scores: Fixture[] } = await request.json();

  if (!scores?.length) {
    return Response.json({ message: "No scores found" }, { status: 400 });
  }

  scores.forEach(({ id, homeGoals, awayGoals }) => {
    updateFixtureScoreAndEvaluatePredictions(id, homeGoals, awayGoals);
  });

  return Response.json(scores);
}

const updateFixtureScoreAndEvaluatePredictions = async (
  fixtureId: number,
  homeGoals?: number | null,
  awayGoals?: number | null
) => {
  if (typeof homeGoals !== "number" || typeof awayGoals !== "number") {
    return;
  }

  // Update the fixture table score BEFORE updating prediction scores.
  await updateFixtureScore(fixtureId, homeGoals, awayGoals);
  await findAllPredictionsAndUpdateScore(fixtureId, homeGoals, awayGoals);
};

const updateFixtureScore = async (
  id: number,
  homeGoals: number,
  awayGoals: number
) => {
  try {
    await prisma.fixture.update({
      where: {
        id,
      },
      data: {
        homeGoals,
        awayGoals,
      },
    });
  } catch (e) {
    Sentry.captureException(`Failed to update fixture score. ${e}`);
  }
};

/**
 * Finds all predictions for the given fixture and updates the score for each prediction.
 */
const findAllPredictionsAndUpdateScore = async (
  fixtureId: number,
  homeGoals: number,
  awayGoals: number
) => {
  const predictions = await prisma.prediction.findMany({
    where: {
      fixtureId,
    },
  });
  if (!predictions?.length) return;

  // Synchronously make the database updates to the prediction table: In time there may be a lot of them
  const results: Prisma.Prisma__PredictionClient<Prediction>[] = [];
  predictions.forEach(
    ({
      userId,
      homeGoals: predictedHomeGoals,
      awayGoals: predictedAwayGoals,
      bigBoyBonus,
    }) => {
      const predictedResult: [number, number, boolean] = [
        predictedHomeGoals || 0,
        predictedAwayGoals || 0,
        bigBoyBonus,
      ];
      const actualResult: [number, number] = [homeGoals, awayGoals];
      const score = calculatePredictionScore(predictedResult, actualResult);

      const dbUpdate = prisma.prediction.update({
        where: {
          fixtureId_userId: {
            fixtureId,
            userId,
          },
        },
        data: {
          score,
        },
      });

      results.push(dbUpdate);
    }
  );

  try {
    await Promise.all(results);
  } catch (e) {
    Sentry.captureException(`Failed to update predictions. ${e}`);
  }
};
