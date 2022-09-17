import React from "react";
import { GetStaticProps } from "next";
import { initializeApollo } from "apollo/client";
import { PREMIER_LEAGUE_QUERY } from "apollo/queries";

import PremierLeague from "src/containers/PremierLeague";
import PremierLeagueTeam from "src/types/PremierLeagueTeam";

interface Props {
  teams: PremierLeagueTeam[];
}

const PremierLeaguePage = ({ teams }: Props) => {
  return <PremierLeague teams={teams} />;
};

export const getStaticProps: GetStaticProps = async () => {
  const apolloClient = initializeApollo();
  const {
    data: { premierLeagueTable },
  } = await apolloClient.query({
    query: PREMIER_LEAGUE_QUERY,
  });

  return {
    props: {
      teams: premierLeagueTable,
    },
  };
};

export default PremierLeaguePage;
