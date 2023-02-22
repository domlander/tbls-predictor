import Prediction from "src/types/Prediction";
import Fixture from "src/types/Fixture";
import FixtureWithPrediction from "src/types/FixtureWithPrediction";

const combineFixturesAndPredictions = (
  fixtures: Fixture[],
  predictions: Prediction[]
): FixtureWithPrediction[] =>
  fixtures.map((fixture) => {
    const prediction = predictions.find((p) => p.fixtureId === fixture.id);
    return {
      fixtureId: fixture.id,
      predictedHomeGoals: prediction?.homeGoals?.toString() || null,
      predictedAwayGoals: prediction?.awayGoals?.toString() || null,
      predictionScore: prediction?.score || null,
      bigBoyBonus: prediction?.bigBoyBonus || false,
      ...fixture,
    };
  });

export default combineFixturesAndPredictions;
