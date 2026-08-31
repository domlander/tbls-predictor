import { User } from "../prisma/generated/client";

export function isUserAlreadyBelongToLeague(
  participants: User[],
  userId: string,
) {
  return participants.some((p) => p.id === userId);
}
