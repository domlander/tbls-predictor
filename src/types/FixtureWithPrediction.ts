import { Fixture, Prediction } from "@prisma/client";

export type FixtureWithPrediction = {
  fixtureId: Fixture["id"];
  kickoff: Fixture["kickoff"];
  homeTeam: Fixture["homeTeam"];
  awayTeam: Fixture["awayTeam"];
  homeGoals: Prediction["homeGoals"];
  awayGoals: Prediction["awayGoals"];
};
