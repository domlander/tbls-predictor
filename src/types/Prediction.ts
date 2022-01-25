import User from "src/types/User";

type Prediction = {
  user: User;
  fixtureId: number;
  homeGoals: number | null;
  awayGoals: number | null;
  big_boy_bonus: boolean;
  score: number | null;
};

export default Prediction;
