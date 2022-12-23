import User from "src/types/User";

export default function isUserBelongToLeague(
  userId: string,
  participants: User[]
) {
  return participants.some((p) => p.id === userId);
}
