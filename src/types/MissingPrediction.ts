import Fixture from "./Fixture";
import Prediction from "./Prediction";

type MissingPrediction = Pick<
  Prediction,
  "fixtureId" | "homeGoals" | "awayGoals" | "bigBoyBonus"
> & {
  fixture: Pick<Fixture, "gameweek" | "homeGoals" | "awayGoals">;
};

export default MissingPrediction;
