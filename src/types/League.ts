import { LeagueStatus } from "@prisma/client";
import Applicant from "./Applicant";
import User from "./User";

type League = {
  id: number;
  name: string;
  status?: LeagueStatus;
  administratorId?: string;
  gameweekStart?: number;
  gameweekEnd?: number;
  applicants?: Applicant[];
  users?: User[];
};

export default League;
