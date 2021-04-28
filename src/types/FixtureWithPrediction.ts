import { Fixture, Prediction } from "@prisma/client";

export type FixtureWithPrediction = {
  fixtureId: Fixture["id"];
  gameweek: Fixture["gameweek"];
  kickoff: Fixture["kickoff"];
  homeTeam: Fixture["homeTeam"];
  awayTeam: Fixture["awayTeam"];
  homeGoals: Fixture["homeGoals"];
  awayGoals: Fixture["awayGoals"];
  predictedHomeGoals: string | null;
  predictedAwayGoals: string | null;
  predictionScore: Prediction["score"];
};
