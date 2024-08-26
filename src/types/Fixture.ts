import Prediction from "./Prediction";

type Fixture = {
  id: number;
  gameweek: number;
  kickoff: Date;
  homeTeam: string;
  awayTeam: string;
  homeGoals: number | null;
  awayGoals: number | null;
  isFinished: boolean;
  predictions?: Prediction[];
};

export default Fixture;
