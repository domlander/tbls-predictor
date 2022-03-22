import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { initializeApollo } from "apollo/client";
import { ALL_FIXTURES_QUERY } from "apollo/queries";
import { calculateCurrentGameweek } from "utils/calculateCurrentGameweek";
import redirectInternal from "utils/redirects";
import Fixture from "src/types/Fixture";

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
    data: { allFixtures },
  }: { data: { allFixtures: Fixture[] } } = await apolloClient.query({
    query: ALL_FIXTURES_QUERY,
  });

  const currentGameweek = calculateCurrentGameweek(allFixtures);

  return redirectInternal(`/predictions/${currentGameweek}`);
};

export default RedirectURL;
