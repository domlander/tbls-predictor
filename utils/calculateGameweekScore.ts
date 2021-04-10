import { EditablePrediction } from "@/types";

export function calculateGameweekScore(predictions: EditablePrediction[]) {
  // If not all results have been entered, the gameweek is not complete
  if (predictions.some((p) => p.score === null)) {
    return null;
  }

  return predictions
    .map((q) => q.score)
    .reduce((acc, score) => acc + (score || 0), 0);
}
