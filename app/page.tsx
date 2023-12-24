import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

import prisma from "prisma/client";
import Home from "src/containers/Home";
import sortFixtures from "utils/sortFixtures";
import generateRecentFixturesByTeam from "utils/generateRecentFixturesByTeam";
import { calculateCurrentGameweek } from "utils/calculateCurrentGameweek";
import getUsersActiveLeagues from "utils/getUsersActiveLeagues";
import { authOptions } from "app/api/auth/[...nextauth]/route";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Predictor | Desmond Two Two",
  description:
    "Predict Premier League football scores. Challenge friends to a score prediction battle with live updates and league tables",
  openGraph: {
    description:
      "Predict Premier League results, create leagues with friends and keep track of your score",
  },
};

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return redirect("/signIn");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  // TODO: Log this error
  if (!user?.id) {
    return redirect("/signIn");
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

  const predictions = await prisma.prediction.findMany({
    where: {
      AND: [
        { userId: session.user.id },
        {
          fixture: {
            gameweek: currentGameweek,
          },
        },
      ],
    },
    include: {
      user: {
        select: {
          id: true,
        },
      },
    },
  });

  return (
    <Home
      weekId={currentGameweek}
      fixtures={sortedFixtures}
      predictions={predictions}
      recentFixturesByTeam={recentFixturesByTeam}
      activeLeagues={activeLeagues}
    />
  );
};

export default Page;
