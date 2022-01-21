import { Applicant } from "./Applicant";
import { WeeklyPoints } from "./WeeklyPoints";
import { Prediction } from "./Prediction";
import { UserLeague } from "./UserLeague";

export type User = {
  id: number;
  username?: string;
  email?: string;
  predictions?: Prediction[];
  leagues?: UserLeague[];
  leagueApplications?: Applicant[];
  totalPoints?: number;
  weeklyPoints?: WeeklyPoints[];
};
