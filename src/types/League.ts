import { LeagueStatus } from "@prisma/client";
import { Applicant } from "./Applicant";
import { User } from "./User";

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
