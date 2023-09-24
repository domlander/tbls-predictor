import Applicant from "src/types/Applicant";
import WeeklyPoints from "src/types/WeeklyPoints";
import Prediction from "src/types/Prediction";
import UserLeague from "src/types/UserLeague";

type User = {
  id: string;
  username?: string;
  email?: string;
  predictions?: Prediction[];
  leagues?: UserLeague[];
  leagueApplications?: Applicant[];
  totalPoints?: number;
  weeklyPoints?: WeeklyPoints[];
  weekPoints?: number;
  perfectPerc?: number;
  correctPerc?: number;
};

export default User;
