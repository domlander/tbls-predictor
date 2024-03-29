import User from "./User";

type UserLeague = {
  leagueId: number;
  leagueName: string;
  gameweekStart?: number;
  gameweekEnd?: number;
  users?: User[];
  weeksToGo?: number | null;
  weeksUntilStart?: number | null;
  position?: number | null;
  numParticipants?: number | null;
  isActive?: boolean;
};

export default UserLeague;
