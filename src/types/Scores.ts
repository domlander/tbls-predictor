import { Prediction, User } from "@prisma/client";

type UserWeeklyScore = {
  id: User["id"];
  username: User["username"];
  score: Prediction["score"];
};

export type WeeklyScores = {
  week: Prediction["score"];
  users: UserWeeklyScore[];
};
