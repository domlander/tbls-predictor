import React from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import styled from "styled-components";
import prisma from "prisma/client";
import Link from "next/link";

import Header from "@/components/Header";
import PredictionTable from "@/components/PredictionTable";
import GameweekNavigator from "@/components/GameweekNavigator";
import { EditablePrediction } from "@/types";
import { convertUrlParamToNumber } from "@/utils";
import { Fixture, League } from "@prisma/client";
import redirectInternal from "../../../../utils/redirects";

interface Props {
  league: League;
  gameweek: number;
  fixtures: Fixture[];
  predictions: EditablePrediction[];
  isUserLeagueAdmin: boolean;
}

const LeaguePage = ({
  league: { id: leagueId, name, gameweekStart, gameweekEnd },
  gameweek,
  fixtures,
  predictions,
  isUserLeagueAdmin,
}: Props) => (
  <Container>
    <Header />
    <Title>{name}</Title>
    {isUserLeagueAdmin && (
      <Link href={`/league/${leagueId}/admin`}>
        <a>Admin</a>
      </Link>
    )}
    <GameweekNavigator
      gameweek={gameweek}
      prevGwUrl={`/league/${leagueId}/week/${gameweek - 1}`}
      nextGwUrl={`/league/${leagueId}/week/${gameweek + 1}`}
      maxGameweeks={gameweekEnd - gameweekStart + 1}
    />
    <PredictionTable
      gameweek={gameweek}
      fixtures={fixtures}
      predictions={predictions}
      gameweekFinished={false} // TODO: This should be true if the gameweek if complete
    />
  </Container>
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
      league: {
        leagueId: league.id,
        name: league.name,
        gameweekStart: league.gameweekStart,
        gameweekEnd: league.gameweekEnd,
      },
      fixtures: JSON.parse(JSON.stringify(fixtures)),
      predictions: JSON.parse(JSON.stringify(editablePredictions)),
      gameweek: weekId,
    },
  };
};

const Container = styled.div``;

const Title = styled.h1`
  color: purple;
  font-size: 30px;
`;

export default LeaguePage;
