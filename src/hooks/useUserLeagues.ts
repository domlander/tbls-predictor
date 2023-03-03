import { useSession } from "next-auth/react";
import { ApolloError, useQuery } from "@apollo/client";
import { USER_LEAGUES_QUERY } from "apollo/queries";
import UserLeague from "src/types/UserLeague";

const useUserLeagues = (): [
  UserLeague[],
  UserLeague[],
  boolean,
  ApolloError | null
] => {
  const { data: session, status: sessionStatus } = useSession();

  const { data, loading, error } = useQuery(USER_LEAGUES_QUERY, {
    skip: !session?.user.id,
    variables: { userId: session?.user.id },
  });

  if (!data || sessionStatus === "loading") return [[], [], true, null];

  if (!session?.user.id) return [[], [], loading, error || null];

  const {
    user: { leagues },
  }: { user: { leagues: UserLeague[] } } = data;

  const activeLeagues = leagues.filter((league) => league.isActive);
  const finishedLeagues = leagues.filter((league) => !league.isActive);

  return [activeLeagues, finishedLeagues, loading, error || null];
};

export default useUserLeagues;
