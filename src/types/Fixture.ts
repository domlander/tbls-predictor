import { Prediction } from "./Prediction";

type Fixture = {
  id: number;
  gameweek: number;
  kickoff: Date;
  homeTeam: string;
  awayTeam: string;
  homeGoals: number | null;
  awayGoals: number | null;
  predictions?: Prediction[];
};

export default Fixture;
