import React from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import { gql } from "@apollo/client";

// import { initializeApollo } from "apollo/client";
import Leagues from "src/containers/Leagues";
import redirectInternal from "../utils/redirects";

export const GET_USER_LEAGUES = gql`
  query leagues($email: String!) {
    leagues(email: $email) {
      id
      name
    }
  }
`;

const LeaguesPage = () => <Leagues />;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return {
      props: {},
      redirect: {
        destination: "/signIn",
        permanent: false,
      },
    };
  }

  if (!session?.user.email) return redirectInternal("/");

  // const apolloClient = initializeApollo();
  // await apolloClient.query({
  //   query: GET_USER_LEAGUES,
  //   variables: { email: session.user.email },
  // });

  return {
    props: {
      // initialApolloState: apolloClient.cache.extract(),
    },
  };
};

export default LeaguesPage;
