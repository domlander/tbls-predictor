import { useState } from "react";
import { useSession } from "next-auth/react";
import { ApolloError, useQuery } from "@apollo/client";

import { USER_LEAGUES_QUERY } from "apollo/queries";
import UserLeague from "src/types/UserLeague";
import User from "src/types/User";

/**
 * We know that gameweekStart and gameweekEnd are provided, so this removes Typescript warnings that
 * these field may not exist. There is a UserLeague type we can use if we can get around this.
 */
type League = {
  leagueId: UserLeague["leagueId"];
  leagueName: UserLeague["leagueName"];
  gameweekStart: number;
  gameweekEnd: number;
  users: User[];
  position: UserLeague["position"];
  weeksToGo?: number | null;
  weeksUntilStart?: number | null;
};

/**
 * If multiple users have the same score, display the highest position with that score.
 * users are sorted by totalPoints descending in the resolver.
 */
const findLeaguePosition = (users: User[], userId: string) => {
  const usersScore = users.find((user) => user.id === userId)?.totalPoints;
  const position = users.findIndex((user) => user.totalPoints === usersScore);
  return position !== -1 ? position + 1 : null;
};

const useUserLeagues = (): [
  League[],
  League[],
  boolean,
  ApolloError | undefined
] => {
  const { data: session } = useSession();
  const [activeLeagues, setActiveLeagues] = useState<League[]>([]);
  const [finishedLeagues, setFinishedLeagues] = useState<League[]>([]);
  const [currentGameweek, setCurrentGameweek] = useState<number | null>();

  const { loading, error } = useQuery(USER_LEAGUES_QUERY, {
    /**
     We don't want the cache a user that belongs to a league, since the same user
     can be in different leagues, and each user's totalPoints varies between leagues.
     An alternative would be to change the users type on UserLeague in typedefs to a
     new LeagueParticipant type, whose cache keys could be leagueId and userId.
    */
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      setCurrentGameweek(data?.allFixtures?.currentGameweek || null);
      setActiveLeagues(data?.user?.activeLeagues || []);
      setFinishedLeagues(data?.user?.finishedLeagues || []);
    },
    skip: !session?.user.id,
  });

  if (!currentGameweek || !session?.user.id) return [[], [], loading, error];

  return [
    activeLeagues.map((league) => ({
      ...league,
      position: findLeaguePosition(league.users, session.user.id),
    })),
    finishedLeagues.map((league) => ({
      ...league,
      position: findLeaguePosition(league.users, session.user.id),
    })),
    loading,
    error,
  ];
};

export default useUserLeagues;
