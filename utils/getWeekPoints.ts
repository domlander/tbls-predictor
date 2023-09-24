import Fixture from "src/types/Fixture";
import Prediction from "src/types/Prediction";
import calculatePredictionScore from "./calculatePredictionScore";

const getWeekPoints = (
  fixtures: Pick<Fixture, "id" | "homeGoals" | "awayGoals">[],
  predictions: Pick<
    Prediction,
    "fixtureId" | "homeGoals" | "awayGoals" | "bigBoyBonus"
  >[]
) => {
  return fixtures.reduce((totalScore, fixture) => {
    const prediction = predictions.find(
      ({ fixtureId }) => fixtureId === fixture.id
    );
    const score = calculatePredictionScore(
      [
        prediction?.homeGoals ?? 0,
        prediction?.awayGoals ?? 0,
        prediction?.bigBoyBonus ?? false,
      ],
      [fixture.homeGoals, fixture.awayGoals]
    );

    return totalScore + score;
  }, 0);
};

export default getWeekPoints;
