import React from "react";
import { GetStaticProps } from "next";
import { initializeApollo } from "apollo/client";
import { ALL_LEAGUES_QUERY } from "apollo/queries";

import Leagues from "src/containers/Leagues";
import League from "src/types/League";

interface Props {
  publicLeagues: League[];
}

const LeaguesPage = ({ publicLeagues }: Props) => {
  return <Leagues publicLeagues={publicLeagues} />;
};

export const getStaticProps: GetStaticProps = async () => {
  const apolloClient = initializeApollo();
  const {
    data: {
      allLeagues: { leagues },
    },
  }: { data: { allLeagues: { leagues: League[] } } } = await apolloClient.query(
    {
      query: ALL_LEAGUES_QUERY,
    }
  );

  return {
    props: {
      publicLeagues: leagues || [],
    },
  };
};

export default LeaguesPage;
