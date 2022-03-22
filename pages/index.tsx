import React from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { getSession } from "next-auth/react";
import prisma from "prisma/client";

import { initializeApollo } from "apollo/client";
import { ALL_FIXTURES_QUERY } from "apollo/queries";
import { calculateCurrentGameweek } from "utils/calculateCurrentGameweek";
import sortFixtures from "utils/sortFixtures";
import Fixture from "src/types/Fixture";
import Home from "@/containers/Home";

interface Props {
  weekId: number;
  fixtures: Fixture[];
}

const HomePage = ({ weekId, fixtures }: Props) => (
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
    <Home weekId={weekId} fixtures={fixtures} />
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
    data: { allFixtures },
  }: { data: { allFixtures: Fixture[] } } = await apolloClient.query({
    query: ALL_FIXTURES_QUERY,
  });

  const thisGameweek = calculateCurrentGameweek(allFixtures);

  const fixtures = sortFixtures(
    allFixtures.filter(({ gameweek }) => gameweek === thisGameweek)
  );

  return {
    props: {
      weekId: thisGameweek,
      fixtures,
    },
  };
};

export default HomePage;
