import { Fixture, Prediction, User } from "@prisma/client";

export type UpdatePredictionsInputType = {
  userId: User["id"];
  fixtureId: Fixture["id"];
  homeGoals: Prediction["homeGoals"];
  awayGoals: Prediction["awayGoals"];
  big_boy_bonus: Prediction["big_boy_bonus"];
};
