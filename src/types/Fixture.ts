import { Prediction } from "./Prediction";

export type Fixture = {
  id: number;
  gameweek: number;
  kickoff: Date;
  homeTeam: string;
  awayTeam: string;
  homeGoals: number | null;
  awayGoals: number | null;
  predictions?: Prediction[];
};
