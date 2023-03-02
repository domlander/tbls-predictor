import React from "react";
import { GetStaticProps } from "next";
import { initializeApollo } from "apollo/client";
import { PREMIER_LEAGUE_QUERY } from "apollo/queries";

import PremierLeague from "src/containers/PremierLeague";
import { PremierLeagueTeam } from "src/types/PremierLeagueTeam";

interface Props {
  premierLeagueTable: PremierLeagueTeam[];
}

type ApolloData = Props;

const PremierLeaguePage = ({ premierLeagueTable }: Props) => {
  return <PremierLeague teams={premierLeagueTable} />;
};

export const getStaticProps: GetStaticProps = async () => {
  const apolloClient = initializeApollo();
  const {
    data: { premierLeagueTable },
  }: { data: ApolloData } = await apolloClient.query({
    query: PREMIER_LEAGUE_QUERY,
  });

  return {
    props: {
      premierLeagueTable,
    },
    revalidate: 1, // Revalidate at quickly as allowed
  };
};

export default PremierLeaguePage;
