import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";

import { CURRENT_GAMEWEEK_QUERY } from "apollo/queries";
import { initializeApollo } from "apollo/client";
import CreateLeague from "src/containers/CreateLeague";

interface Props {
  currentGameweek: number;
}

const CreateLeaguePage = ({ currentGameweek }: Props) => (
  <CreateLeague currentGameweek={currentGameweek} />
);

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
    data: { currentGameweek },
  }: {
    data: { currentGameweek: number };
  } = await apolloClient.query({
    query: CURRENT_GAMEWEEK_QUERY,
  });

  return {
    props: {
      currentGameweek,
    },
  };
};

export default CreateLeaguePage;
