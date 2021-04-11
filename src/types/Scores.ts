import { Prediction, User } from "@prisma/client";

export type UserWeeklyScore = {
  id: User["id"];
  username: User["username"];
  score: Prediction["score"];
};

export type WeeklyScores = {
  week: Prediction["score"];
  users: UserWeeklyScore[];
};
