type PremierLeagueTeam = {
  team: string;
  points: number;
  wins: number;
  draws: number;
  losses: number;
  homeGoals: number;
  homeGoalsConceded: number;
  awayGoals: number;
  awayGoalsConceded: number;
};

type PremierLeagueTeamDisplay = PremierLeagueTeam & {
  played: number;
  goalsScored: number;
  goalsConceded: number;
  goalDifference: number;
};

export type { PremierLeagueTeam, PremierLeagueTeamDisplay };
