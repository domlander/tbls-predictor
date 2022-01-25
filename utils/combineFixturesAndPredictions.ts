import Prediction from "src/types/Prediction";
import Fixture from "src/types/Fixture";
import FixtureWithPrediction from "src/types/FixtureWithPrediction";

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
      bigBoyBonus: prediction?.bigBoyBonus || false,
      ...f,
    };
  });

export default combineFixturesAndPredictions;
