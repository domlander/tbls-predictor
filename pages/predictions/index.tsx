import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { initializeApollo } from "apollo/client";
import { ALL_FIXTURES_QUERY } from "apollo/queries";
import redirectInternal from "utils/redirects";

const RedirectURL = () => null;

const getCurrentGameweekFromFixtures = async () => {
  const apolloClient = initializeApollo();

  const {
    data: {
      allFixtures: { currentGameweek },
    },
  }: {
    data: { allFixtures: { currentGameweek: number } };
  } = await apolloClient.query({
    query: ALL_FIXTURES_QUERY,
  });

  return currentGameweek;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return Promise.all([
    getSession(context),
    getCurrentGameweekFromFixtures(),
  ]).then(([session, currentGameweek]) => {
    return !session?.user.id
      ? redirectInternal("/signIn")
      : redirectInternal(`/predictions/${currentGameweek}`);
  });
};

export default RedirectURL;
