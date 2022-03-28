import React from "react";

import useUserLeagues from "src/hooks/useUserLeagues";
import League from "src/types/League";
import Loading from "src/components/Loading";
import LeaguesList from "src/components/LeagueList";
import PublicLeaguesList from "src/components/PublicLeaguesList";
import Heading from "src/components/Heading";

interface Props {
  publicLeagues: League[];
}

const Leagues = ({ publicLeagues }: Props) => {
  const [userLeagues, loading, error] = useUserLeagues();

  if (loading) return <Loading />;
  if (error) return <div>An error has occurred. Please try again later.</div>;

  return (
    <main>
      <Heading level="h1">Leagues</Heading>
      <LeaguesList leagues={userLeagues} />
      <PublicLeaguesList leagues={publicLeagues} />
    </main>
  );
};

export default Leagues;
