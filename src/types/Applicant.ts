import { LeagueApplicantStatus } from "@prisma/client";
import League from "./League";
import User from "./User";

type Applicant = {
  user: Pick<User, "id" | "username">;
  league?: Pick<League, "id">;
  status?: LeagueApplicantStatus;
  createdAt?: Date;
};

export default Applicant;
