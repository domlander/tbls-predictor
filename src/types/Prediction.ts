import User from "src/types/User";

type Prediction = {
  user: User;
  fixtureId: number;
  homeGoals: number | null;
  awayGoals: number | null;
  bigBoyBonus: boolean;
  score: number | null;
};

export default Prediction;
