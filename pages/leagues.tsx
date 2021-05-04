import React from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";

// import { initializeApollo } from "apollo/client";
import Leagues from "src/containers/Leagues";
import redirectInternal from "../utils/redirects";

interface Props {
  userId: number;
}
const LeaguesPage = ({ userId }: Props) => <Leagues userId={userId} />;

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
  if (!session?.user.id) return redirectInternal("/");

  // const apolloClient = initializeApollo();
  // await apolloClient.query({
  //   query: USER_LEAGUES,
  //   variables: { email: session.user.email },
  // });

  return {
    props: {
      userId: session?.user.id,
      // initialApolloState: apolloClient.cache.extract(),
    },
  };
};

export default LeaguesPage;
