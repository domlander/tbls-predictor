import { Applicant } from "../prisma/generated/client";

export default function isUserAppliedToLeague(
  applicants: Applicant[],
  userId: string,
) {
  return applicants.some(
    (p) =>
      p.userId === userId &&
      (p.status === "applied" || p.status === "accepted"),
  );
}
