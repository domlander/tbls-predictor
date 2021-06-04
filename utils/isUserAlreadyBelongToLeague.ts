import { User } from "@prisma/client";

export function isUserAlreadyBelongToLeague(
  participants: User[],
  userId: number
) {
  return participants.some((p) => p.id === userId);
}
