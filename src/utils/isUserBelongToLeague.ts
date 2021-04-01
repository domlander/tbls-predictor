import { User } from ".prisma/client";

export function  isUserBelongToLeague(participants: User[], userId: number) {
  return participants.some(p => p.id === userId)
}
