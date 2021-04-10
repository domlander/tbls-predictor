import { EditablePrediction } from "@/types";

export function calculateGameweekScore(predictions: EditablePrediction[]) {
  if (predictions.some((p) => p.score === null)) {
    return null;
  }

  return predictions
    .map((q) => q.score)
    .reduce((total, score) => total + (score || 0), 0);
}
