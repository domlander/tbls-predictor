import React from "react";
import { GetStaticProps } from "next";
import { initializeApollo } from "apollo/client";
import { ALL_LEAGUES_QUERY } from "apollo/queries";

import Leagues from "src/containers/Leagues";
import { League } from "src/types/League";
import Heading from "@/components/atoms/Heading";

interface Props {
  publicLeagues: League[];
}

const LeaguesPage = ({ publicLeagues }: Props) => {
  return (
    <>
      <Heading level="h1">Leagues</Heading>
      <Leagues publicLeagues={publicLeagues} />
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const apolloClient = initializeApollo();
  const {
    data: { allLeagues },
  } = await apolloClient.query({
    query: ALL_LEAGUES_QUERY,
  });

  return {
    props: {
      publicLeagues: allLeagues?.leagues || [],
    },
  };
};

export default LeaguesPage;
