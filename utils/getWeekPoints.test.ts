import Fixture from "src/types/Fixture";
import Prediction from "src/types/Prediction";
import getWeekPoints from "./getWeekPoints";

describe("getWeekPoints", () => {
  const fixtures: Pick<Fixture, "id" | "homeGoals" | "awayGoals">[] = [
    {
      id: 1,
      homeGoals: 1,
      awayGoals: 1,
    },
  ];
  const predictions: Pick<
    Prediction,
    "fixtureId" | "homeGoals" | "awayGoals" | "bigBoyBonus"
  >[] = [
    {
      fixtureId: 1,
      homeGoals: 1,
      awayGoals: 1,
      bigBoyBonus: false,
    },
  ];

  it("returns the correct score", () => {
    const result = getWeekPoints(fixtures, predictions);

    expect(result).toBe(3);
  });
});
