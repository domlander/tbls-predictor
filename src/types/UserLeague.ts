type UserLeague = {
  leagueId: number;
  leagueName: string;
  position?: number;
  gameweekStart?: number;
  gameweekEnd?: number;
  weeksToGo?: number | null;
  weeksUntilStart?: number | null;
};

export default UserLeague;
