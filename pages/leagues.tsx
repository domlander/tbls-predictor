import React from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { addApolloState, initializeApollo } from "apollo/client";
import { USER_LEAGUES_QUERY } from "apollo/queries";
import Leagues from "src/containers/Leagues";
import redirectInternal from "utils/redirects";

const LeaguesPage = () => {
  return <Leagues />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session?.user?.id) {
    return redirectInternal("/signIn");
  }

  const apolloClient = initializeApollo();
  const { data } = await apolloClient.query({
    query: USER_LEAGUES_QUERY,
    variables: { userId: session.user.id },
  });

  if (!data) return { notFound: true };

  /**
   * The GraphQL query has been run on the server.
   * Populate the cache on the client with the results.
   */
  return addApolloState(apolloClient, {
    props: {},
  });
};

export default LeaguesPage;
