import Applicant from "src/types/Applicant";
import WeeklyPoints from "src/types/WeeklyPoints";
import Prediction from "src/types/Prediction";
import UserLeague from "src/types/UserLeague";

type User = {
  id: number;
  username?: string;
  email?: string;
  predictions?: Prediction[];
  leagues?: UserLeague[];
  leagueApplications?: Applicant[];
  totalPoints?: number;
  weeklyPoints?: WeeklyPoints[];
};

export default User;
