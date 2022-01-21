import React from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import { calculateCurrentGameweek } from "utils/calculateCurrentGameweek";
import { ALL_FIXTURES_QUERY } from "apollo/queries";
import { initializeApollo } from "apollo/client";
import CreateLeague from "@/containers/CreateLeague";

interface Props {
  currentGameweek: number;
}

const CreateLeaguePage = ({ currentGameweek }: Props) => (
  <CreateLeague currentGameweek={currentGameweek} />
);

export default CreateLeaguePage;

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
  } = await apolloClient.query({
    query: ALL_FIXTURES_QUERY,
  });

  const thisGameweek = calculateCurrentGameweek(allFixtures);

  return { props: { currentGameweek: thisGameweek } };
};
