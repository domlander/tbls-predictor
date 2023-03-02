export type PremierLeagueTeam = {
  team: string;
  points: number;
  wins: number;
  draws: number;
  losses: number;
  homeGoals: number;
  homeGoalsConceded: number;
  awayGoals: number;
  awayGoalsConceded: number;
  played?: number;
  goalsScored?: number;
  goalsConceded?: number;
  goalDifference?: number;
  predictedPoints?: number;
};
