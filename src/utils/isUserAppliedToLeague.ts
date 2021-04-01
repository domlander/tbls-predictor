import { Applicant } from "@prisma/client";

export function isUserAppliedToLeague(applicants: Applicant[], userId: number) {
  return applicants.some(p => p.userId === userId && p.status === 'applied')
}