import { useState } from "react";
import { ApolloError, useQuery } from "@apollo/client";

import { USER_LEAGUES_QUERY } from "apollo/queries";
import UserLeague from "src/types/UserLeague";

/**
 * We know that gameweekStart and gameweekEnd are provided, so this removes Typescript warnings that
 * these field may not exist. There is a UserLeague type we can use if we can get around this.
 */
type League = {
  leagueId: UserLeague["leagueId"];
  leagueName: UserLeague["leagueName"];
  gameweekStart: number;
  gameweekEnd: number;
  position: UserLeague["leagueId"];
  weeksToGo?: number | null;
  weeksUntilStart?: number | null;
};

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

const leagueMapping = (league: League, currentGameweek: number) => {
  if (!league.gameweekStart || !league.gameweekEnd) return league;

  return {
    ...league,
    weeksToGo: calculateWeeksRemaining(currentGameweek, league.gameweekEnd),
    weeksUntilStart: calculateWeeksUntilStart(
      currentGameweek,
      league.gameweekStart
    ),
  };
};

const useUserLeagues = (): [
  League[],
  League[],
  boolean,
  ApolloError | undefined
] => {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [currentGameweek, setCurrentGameweek] = useState<number | null>();

  const { loading, error } = useQuery(USER_LEAGUES_QUERY, {
    onCompleted: (data) => {
      setCurrentGameweek(data?.allFixtures?.currentGameweek || null);
      setLeagues(data?.user?.leagues || []);
    },
  });

  if (!currentGameweek) return [[], [], loading, error];

  const activeLeagues = leagues
    .filter((league) => league.gameweekEnd >= currentGameweek)
    .map((league) => leagueMapping(league, currentGameweek))
    .sort((a, b) => a.gameweekStart - b.gameweekStart);

  const finishedLeagues = leagues
    .filter((league) => league.gameweekEnd < currentGameweek)
    .map((league) => leagueMapping(league, currentGameweek))
    .sort((a, b) => b.gameweekEnd - a.gameweekEnd);

  return [activeLeagues, finishedLeagues, loading, error];
};

export default useUserLeagues;
