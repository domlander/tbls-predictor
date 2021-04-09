import { Fixture } from "@prisma/client";

export type EditablePrediction = {
  fixtureId: Fixture["id"];
  homeGoals: string | null;
  awayGoals: string | null;
  score?: number | null;
};
