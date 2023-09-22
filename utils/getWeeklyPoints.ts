import Fixture from "src/types/Fixture";
import Prediction from "src/types/Prediction";
import calculatePredictionScore from "./calculatePredictionScore";

const getWeeklyPoints = (
  fixtures: Pick<Fixture, "id" | "gameweek" | "homeGoals" | "awayGoals">[],
  predictions: Pick<
    Prediction,
    "fixtureId" | "homeGoals" | "awayGoals" | "bigBoyBonus"
  >[],
  gameweekStart: number,
  gameweekEnd: number
) => {
  return fixtures
    .filter(
      ({ gameweek }) => gameweek >= gameweekStart && gameweek <= gameweekEnd
    )
    .reduce(
      (acc, cur) => {
        const prediction = predictions.find(
          ({ fixtureId }) => fixtureId === cur.id
        );
        const score = calculatePredictionScore(
          [
            prediction?.homeGoals ?? 0,
            prediction?.awayGoals ?? 0,
            prediction?.bigBoyBonus ?? false,
          ],
          [cur.homeGoals, cur.awayGoals]
        );

        const arrayIndex = cur.gameweek - gameweekStart;
        acc[arrayIndex] = {
          week: cur.gameweek,
          points: (acc[arrayIndex].points += score),
        };

        return acc;
      },
      new Array(gameweekEnd - gameweekStart + 1)
        .fill(0)
        .map((_, i) => ({ week: i + gameweekStart, points: 0 }))
    );
};

export default getWeeklyPoints;
