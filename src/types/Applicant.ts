import { LeagueApplicantStatus, User } from "@prisma/client";

type UserDetails = {
  id: User["id"];
  username: User["username"];
};

export type Applicant = {
  user: UserDetails;
  status: LeagueApplicantStatus;
};
