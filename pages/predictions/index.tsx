import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { initializeApollo } from "apollo/client";
import { ALL_FIXTURES_QUERY } from "apollo/queries";
import redirectInternal from "utils/redirects";

const RedirectURL = () => null;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session?.user?.id) {
    return {
      props: {},
      redirect: {
        destination: "/signIn",
        permanent: false,
      },
    };
  }

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

  return redirectInternal(`/predictions/${currentGameweek}`);
};

export default RedirectURL;
