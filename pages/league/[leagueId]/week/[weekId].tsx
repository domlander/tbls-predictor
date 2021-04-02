import React, { FormEvent } from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import styled from "styled-components";
import prisma from "prisma/client";
import Link from "next/link";

import Header from "@/components/Header";
import PredictionTable from "@/components/PredictionTable";
import GameweekNavigator from "@/components/GameweekNavigator";
import { League } from "@/types";
import { convertUrlParamToNumber } from "@/utils";
import { Fixture } from "@prisma/client";
import redirectInternal from "../../../../utils/redirects";

interface Props {
  league: League;
  gameweek: number;
  fixtures: Fixture[];
  isUserLeagueAdmin: boolean;
}

const handleSubmitPredictions = (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  // console.log("e", e.target);
};

const LeaguePage = ({
  league: { leagueId, name, gameweekStart, gameweekEnd },
  gameweek,
  fixtures = [],
  isUserLeagueAdmin,
}: Props) => {
  const prevGwUrl = `/league/${leagueId}/week/${gameweek - 1}`;
  const nextGwUrl = `/league/${leagueId}/week/${gameweek + 1}`;

  return (
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
        prevGwUrl={prevGwUrl}
        nextGwUrl={nextGwUrl}
        maxGameweeks={gameweekEnd - gameweekStart + 1}
      />
      <PredictionTable
        fixtures={fixtures}
        handleSubmitPredictions={handleSubmitPredictions}
        // TODO: This should be true if the gameweek if complete
        gameweekFinished={false}
      />
    </Container>
  );
};

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

  const fixtures = await prisma.fixture.findMany({
    where: {
      gameweek: weekId,
    },
  });

  if (!league) return redirectInternal("/leagues");

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
