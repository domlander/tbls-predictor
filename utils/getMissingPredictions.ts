import Fixture from "src/types/Fixture";
import MissingPrediction from "src/types/MissingPrediction";
import Prediction from "src/types/Prediction";

/**
 * Where a fixture doesn't have a prediction with a matching ID, a new prediction will be
 * created with 0-0 as the score. Returns an array of all these missed predictions.
 */
export const getMissingPredictions = (
  predictions: Partial<Prediction>[],
  fixtures: Fixture[]
) => {
  if (!predictions) return [];

  return fixtures.reduce<MissingPrediction[]>((acc, fixture) => {
    // Add missed predictions as 0-0
    if (
      predictions.findIndex(({ fixtureId }) => fixtureId === fixture.id) === -1
    ) {
      acc.push({
        fixtureId: fixture.id,
        homeGoals: 0,
        awayGoals: 0,
        bigBoyBonus: false,
        fixture: {
          gameweek: fixture.gameweek,
          homeGoals: fixture.homeGoals,
          awayGoals: fixture.awayGoals,
        },
      });
    }

    return acc;
  }, []);
};
