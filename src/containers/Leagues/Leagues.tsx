import React from "react";

import useUserLeagues from "src/hooks/useUserLeagues";
import { League } from "src/types/NewTypes";
import Loading from "@/components/atoms/Loading";
import LeaguesList from "@/components/molecules/LeagueList";
import PublicLeaguesList from "@/components/molecules/PublicLeaguesList";

interface Props {
  publicLeagues: League[];
}

const Leagues = ({ publicLeagues }: Props) => {
  const [userLeagues, loading, error] = useUserLeagues();

  if (loading) return <Loading />;
  if (error) return <div>An error has occurred. Please try again later.</div>;

  return (
    <>
      <LeaguesList leagues={userLeagues} />
      <PublicLeaguesList leagues={publicLeagues} />
    </>
  );
};

export default Leagues;
