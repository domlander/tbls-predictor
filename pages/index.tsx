import React from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { getSession } from "next-auth/react";
import prisma from "prisma/client";

import { initializeApollo } from "apollo/client";
import { ALL_FIXTURES_QUERY } from "apollo/queries";
import sortFixtures from "utils/sortFixtures";
import Fixture from "src/types/Fixture";
import Home from "src/containers/Home";
import generateRecentFixturesByTeam from "utils/generateRecentFixturesByTeam";
import TeamFixtures from "src/types/TeamFixtures";

interface Props {
  weekId: number;
  fixtures: Fixture[];
  recentFixturesByTeam: TeamFixtures[];
}

const HomePage = ({ weekId, fixtures, recentFixturesByTeam }: Props) => (
  <>
    <Head>
      <meta
        name="description"
        content="Predict Premier League football scores. Challenge friends to a score prediction battle with live updates and league tables."
      />
      <meta
        property="og:description"
        content="Predict Premier League results, create leagues with friends and keep track of your score."
      />
    </Head>
    <Home
      weekId={weekId}
      fixtures={fixtures}
      recentFixturesByTeam={recentFixturesByTeam}
    />
  </>
);

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

  if (!session?.user?.email) {
    // TODO: Log this strange behaviour: Session is found but no email address
    return { props: {} };
  }

  // TODO: Can we move this to account creation?
  // Give user a username if they do not have one.
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user?.username) {
    let username = session.user.email.split("@")[0];

    if (username.length < 3) username += "_user";
    await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        username,
      },
    });
  }

  const apolloClient = initializeApollo();
  const {
    data: {
      allFixtures: { fixtures, currentGameweek },
    },
  }: {
    data: { allFixtures: { fixtures: Fixture[]; currentGameweek: number } };
  } = await apolloClient.query({
    query: ALL_FIXTURES_QUERY,
  });

  const sortedFixtures = sortFixtures(
    fixtures.filter(({ gameweek }) => gameweek === currentGameweek)
  );

  const recentFixturesByTeam = generateRecentFixturesByTeam(
    fixtures,
    currentGameweek
  );

  return {
    props: {
      weekId: currentGameweek,
      fixtures: sortedFixtures,
      recentFixturesByTeam,
    },
  };
};

export default HomePage;
