import React from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";

import Fixture from "src/types/Fixture";
import ManageFixtures from "src/containers/AdminManageFixtures";
import { initializeApollo } from "apollo/client";
import { ALL_FIXTURES_QUERY } from "apollo/queries";

interface Props {
  currentGameweek: number;
  fixtures: Fixture[];
}

const ManageFixturesPage = ({ currentGameweek, fixtures }: Props) => (
  <ManageFixtures gameweek={currentGameweek} fixtures={fixtures} />
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  // TODO Replace with roles https://github.com/nextauthjs/next-auth/discussions/805
  if (session?.user?.email !== process.env.ADMIN_EMAIL) {
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
      allFixtures: { fixtures: allFixtures, currentGameweek },
    },
  }: {
    data: { allFixtures: { fixtures: Fixture[]; currentGameweek: number } };
  } = await apolloClient.query({
    query: ALL_FIXTURES_QUERY,
  });

  const fixtures = allFixtures
    .filter((fixture) => fixture.gameweek === currentGameweek)
    .map((fixture) => ({
      ...fixture,
      kickoff: fixture.kickoff.toString(),
    }));

  return {
    props: {
      currentGameweek,
      fixtures,
    },
  };
};

export default ManageFixturesPage;
