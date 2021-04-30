import React from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";

import { gql } from "@apollo/client";
import { initializeApollo } from "apollo/client";

import { League } from "@prisma/client";
import Leagues from "src/containers/Leagues";
import redirectInternal from "../utils/redirects";

interface Props {
  leagues: Array<League>;
}

const GET_USER_LEAGUES = gql`
  query UserLeagues($email: String!) {
    userLeagues(email: $email) {
      id
      name
    }
  }
`;

const LeaguesPage = ({ leagues }: Props) => <Leagues leagues={leagues} />;

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

  const apolloClient = initializeApollo();
  const { data } = await apolloClient.query({
    // TODO log errors
    query: GET_USER_LEAGUES,
    variables: { email: session.user.email },
  });

  // If the user does not belong to any leagues, get them to join a league
  if (!data?.userLeagues) return redirectInternal("/league/join");

  return {
    props: {
      leagues: JSON.parse(JSON.stringify(data?.userLeagues)),
    },
  };
};

export default LeaguesPage;
