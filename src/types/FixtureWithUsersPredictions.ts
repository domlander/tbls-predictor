import { Fixture, Prediction } from "@prisma/client";

export type FixtureWithUsersPredictions = {
  id: Fixture["id"];
  kickoff: Fixture["kickoff"];
  gameweek: Fixture["gameweek"];
  homeTeam: Fixture["homeTeam"];
  awayTeam: Fixture["awayTeam"];
  homeGoals: Fixture["homeGoals"];
  awayGoals: Fixture["awayGoals"];
  predictions: Pick<
    Prediction,
    "homeGoals" | "awayGoals" | "big_boy_bonus" | "score"
  >[];
};
