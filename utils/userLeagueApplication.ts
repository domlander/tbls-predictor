import { Applicant, User } from "@prisma/client";

export const isUserAlreadyBelongToLeague = (
  participants: User[],
  userId: number
) => participants.some((p) => p.id === userId);

export const isUserAppliedToLeague = (
  applicants: Applicant[],
  userId: number
) =>
  applicants.some(
    (p) =>
      p.userId === userId && (p.status === "applied" || p.status === "accepted")
  );
