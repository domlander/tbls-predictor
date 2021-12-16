import React from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import Head from "next/head";
import prisma from "prisma/client";

import { initializeApollo } from "apollo/client";
import { ALL_FIXTURES_QUERY } from "apollo/queries";
import { calculateCurrentGameweek } from "utils/calculateCurrentGameweek";
import Home from "@/containers/Home";

interface Props {
  userId: number;
  weekId: number;
}

const HomePage = ({ userId, weekId }: Props) => (
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
    <Home userId={userId} weekId={weekId} />
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
    data: { fixtures },
  } = await apolloClient.query({
    query: ALL_FIXTURES_QUERY,
  });

  const weekId = calculateCurrentGameweek(fixtures);

  return {
    props: {
      userId: session.user.id,
      weekId,
    },
  };
};

export default HomePage;
