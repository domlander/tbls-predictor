import { GetServerSideProps } from "next";
import Head from "next/head";
import { getSession } from "next-auth/react";
import prisma from "prisma/client";

import sortFixtures from "utils/sortFixtures";
import Fixture from "src/types/Fixture";
import Home from "src/containers/Home";
import generateRecentFixturesByTeam from "utils/generateRecentFixturesByTeam";
import TeamFixtures from "src/types/TeamFixtures";
import UserLeague from "src/types/UserLeague";
import { calculateCurrentGameweek } from "utils/calculateCurrentGameweek";
import getUsersActiveLeagues from "utils/getUsersActiveLeagues";

interface Props {
  weekId: number;
  fixtures: Fixture[];
  recentFixturesByTeam: TeamFixtures[];
  activeLeagues: UserLeague[];
}

const HomePage = ({
  weekId,
  fixtures,
  recentFixturesByTeam,
  activeLeagues,
}: Props) => (
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
      activeLeagues={activeLeagues}
    />
  </>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session?.user?.email) {
    // TODO: Log this error
    return {
      props: {},
      redirect: {
        destination: "/signIn",
        permanent: false,
      },
    };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user?.id) {
    return {
      props: {},
      redirect: {
        destination: "/signIn",
        permanent: false,
      },
    };
  }

  // TODO: Can we move this to account creation?
  // Give user a username if they do not have one.
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

  const fixtures = await prisma.fixture.findMany({
    select: {
      id: true,
      gameweek: true,
      kickoff: true,
      homeTeam: true,
      awayTeam: true,
      homeGoals: true,
      awayGoals: true,
    },
  });

  const currentGameweek = calculateCurrentGameweek(fixtures);

  const sortedFixtures = sortFixtures(
    fixtures.filter(({ gameweek }) => gameweek === currentGameweek)
  );

  const recentFixturesByTeam = generateRecentFixturesByTeam(
    fixtures,
    currentGameweek
  );

  const activeLeagues = await getUsersActiveLeagues(
    user.id,
    fixtures,
    currentGameweek
  );

  return {
    props: {
      weekId: currentGameweek,
      fixtures: JSON.parse(JSON.stringify(sortedFixtures)),
      recentFixturesByTeam: JSON.parse(JSON.stringify(recentFixturesByTeam)),
      activeLeagues: JSON.parse(JSON.stringify(activeLeagues)),
    },
  };
};

export default HomePage;
