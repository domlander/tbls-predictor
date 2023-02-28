import User from "src/types/User";

type PartialUser = Pick<User, "id" | "totalPoints">;

const calculateUsersLeaguePosition = (
  users: PartialUser[],
  thisUserId: string
): number | null => {
  const usersScore = users.find(({ id }) => id === thisUserId)?.totalPoints;

  const position = users.findIndex((user) => user.totalPoints === usersScore);
  if (position === -1) {
    return null;
  }

  return position + 1;
};

export default calculateUsersLeaguePosition;
