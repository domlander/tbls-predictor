import { Fixture, Prediction } from "@prisma/client";
import { FixtureWithPrediction } from "@/types";

const combineFixturesAndPredictions = (
  fixtures: Fixture[],
  predictions: Prediction[]
): FixtureWithPrediction[] =>
  fixtures.map((f) => {
    const prediction = predictions.find((p) => p.fixtureId === f.id);
    return {
      fixtureId: f.id,
      predictedHomeGoals: prediction?.homeGoals?.toString() || null,
      predictedAwayGoals: prediction?.awayGoals?.toString() || null,
      predictionScore: prediction?.score || null,
      big_boy_bonus: prediction?.big_boy_bonus || false,
      ...f,
    };
  });

export default combineFixturesAndPredictions;
