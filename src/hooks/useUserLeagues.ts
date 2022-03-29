import { useState } from "react";
import { useQuery } from "@apollo/client";

import { USER_LEAGUES_QUERY } from "apollo/queries";
import UserLeague from "src/types/UserLeague";

const calculateWeeksRemaining = (
  currentGameweek: number,
  gameweekEnd: number
): number | null => {
  const weeksRemaining = gameweekEnd - currentGameweek + 1;

  return weeksRemaining > 0 ? weeksRemaining : null;
};

const calculateWeeksUntilStart = (
  currentGameweek: number,
  gameweekStart: number
): number | null => {
  const weeksUntilStart = gameweekStart - currentGameweek + 1;

  return weeksUntilStart > 0 ? weeksUntilStart : null;
};

const useUserLeagues = () => {
  const [leagues, setLeagues] = useState<UserLeague[]>([]);
  const [currentGameweek, setCurrentGameweek] = useState<number | null>();

  const { loading, error } = useQuery(USER_LEAGUES_QUERY, {
    onCompleted: (data) => {
      setCurrentGameweek(data?.allFixtures?.currentGameweek || null);
      setLeagues(data?.user?.leagues || []);
    },
  });

  const userLeagues = leagues.map((league) => {
    if (!currentGameweek || !league.gameweekStart || !league.gameweekEnd)
      return league;

    return {
      ...league,
      weeksToGo: calculateWeeksRemaining(currentGameweek, league.gameweekEnd),
      weeksUntilStart: calculateWeeksUntilStart(
        currentGameweek,
        league.gameweekStart
      ),
    };
  });

  return [userLeagues, loading, error];
};

export default useUserLeagues;
