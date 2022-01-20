import { LeagueApplicantStatus, LeagueStatus } from "@prisma/client";

export type Applicant = {
  user: Pick<User, "id" | "username">;
  league: Pick<League, "id">;
  status?: LeagueApplicantStatus;
  createdAt?: Date;
};

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

export type UserLeague = {
  leagueId: number;
  leagueName: string;
  position?: number;
  weeksToGo?: number;
};

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

export type Prediction = {
  user: User;
  fixtureId: number;
  homeGoals: number | null;
  awayGoals: number | null;
  big_boy_bonus: boolean;
  score: number | null;
};

export type League = {
  id: number;
  name: string;
  status?: LeagueStatus;
  administratorId?: number;
  gameweekStart?: number;
  gameweekEnd?: number;
  applicants?: Applicant[];
  users?: User[];
};

export type WeeklyPoints = {
  week: number;
  points: number;
};

export type UserPoints = {
  userId: number;
  username?: string;
  points: number;
};
