import React from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import prisma from "prisma/client";

import { EditablePrediction } from "@/types";
import { convertUrlParamToNumber } from "@/utils";
import { Fixture, League } from "@prisma/client";
import Week from "src/containers/Week";
import redirectInternal from "../../../../utils/redirects";

interface Props {
  league: League;
  gameweek: number;
  fixtures: Fixture[];
  predictions: EditablePrediction[];
  isUserLeagueAdmin: boolean;
}

const WeekPage = ({
  league,
  gameweek,
  fixtures,
  predictions,
  isUserLeagueAdmin,
}: Props) => (
  <Week
    league={league}
    gameweek={gameweek}
    fixtures={fixtures}
    initialPredictions={predictions}
    isUserLeagueAdmin={isUserLeagueAdmin}
  />
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) return redirectInternal("/");

  // Get the logged in user
  const user = await prisma.user.findUnique({
    where: {
      email: session?.user.email || "",
    },
  });

  const leagueId = convertUrlParamToNumber(context.params?.leagueId);
  const weekId = convertUrlParamToNumber(context.params?.weekId);

  if (!user || !leagueId || !weekId || leagueId <= 0 || weekId <= 0) {
    return redirectInternal("/leagues");
  }

  const league = await prisma.league.findUnique({
    where: {
      id: leagueId || undefined,
    },
  });
  if (!league) return redirectInternal("/leagues");

  const fixtures = await prisma.fixture.findMany({
    where: {
      gameweek: weekId,
    },
  });
  if (!fixtures) return redirectInternal("/leagues");

  fixtures.sort(
    (a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime()
  );

  const predictions = await prisma.prediction.findMany({
    where: {
      AND: {
        userId: user.id,
        fixtureId: { in: fixtures.map((fixture) => fixture.id) }, // filter predictions by fixture ID's of this gameweek
      },
    },
  });

  const editablePredictions: EditablePrediction[] = [];
  fixtures.map((fixture) => {
    const prediction = predictions.find((p) => p.fixtureId === fixture.id);
    return editablePredictions.push({
      fixtureId: fixture.id,
      homeGoals: prediction?.homeGoals?.toString() || "",
      awayGoals: prediction?.awayGoals?.toString() || "",
    });
  });

  return {
    props: {
      isUserLeagueAdmin: league.administratorId === user.id,
      league: JSON.parse(JSON.stringify(league)),
      fixtures: JSON.parse(JSON.stringify(fixtures)),
      predictions: JSON.parse(JSON.stringify(editablePredictions)),
      gameweek: weekId,
    },
  };
};

export default WeekPage;
