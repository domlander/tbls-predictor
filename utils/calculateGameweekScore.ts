import { FixtureWithPrediction } from "@/types";

export function calculateGameweekScore(predictions: FixtureWithPrediction[]) {
  // If not all results have been entered, the gameweek is not complete
  if (predictions.some((p) => p.predictionScore === null)) {
    return null;
  }

  return predictions
    .map((q) => q.predictionScore)
    .reduce((acc, score) => (acc || 0) + (score || 0), 0);
}
