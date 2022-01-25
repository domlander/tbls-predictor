import Prediction from "./Prediction";
import Fixture from "./Fixture";

type FixtureWithPrediction = {
  fixtureId: Fixture["id"];
  gameweek: Fixture["gameweek"];
  kickoff: Fixture["kickoff"];
  homeTeam: Fixture["homeTeam"];
  awayTeam: Fixture["awayTeam"];
  homeGoals: Fixture["homeGoals"];
  awayGoals: Fixture["awayGoals"];
  predictedHomeGoals: string | null;
  predictedAwayGoals: string | null;
  bigBoyBonus: Prediction["bigBoyBonus"];
  predictionScore: Prediction["score"];
};

export default FixtureWithPrediction;
