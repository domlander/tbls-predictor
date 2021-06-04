import { User } from ".prisma/client";

export default function isUserBelongToLeague(
  userId: number,
  participants: User[]
) {
  return participants.some((p) => p.id === userId);
}
