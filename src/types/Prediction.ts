import { User } from "./User";

export type Prediction = {
  user: User;
  fixtureId: number;
  homeGoals: number | null;
  awayGoals: number | null;
  big_boy_bonus: boolean;
  score: number | null;
};
