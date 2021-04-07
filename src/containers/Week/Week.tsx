import React from "react";
import styled from "styled-components";
import Link from "next/link";

import Header from "@/components/Header";
import PredictionTable from "@/components/PredictionTable";
import GameweekNavigator from "@/components/GameweekNavigator";
import { EditablePrediction } from "@/types";
import { Fixture, League } from "@prisma/client";

interface Props {
  league: League;
  gameweek: number;
  fixtures: Fixture[];
  predictions: EditablePrediction[];
  isUserLeagueAdmin: boolean;
}

const WeekContainer = ({
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
      <div>
        <Link href={`/league/${leagueId}/admin`}>
          <a>Admin</a>
        </Link>
      </div>
    )}
    <div>
      <Link href={`/league/${leagueId}/table`}>
        <a>Table</a>
      </Link>
    </div>
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

const Container = styled.div``;

const Title = styled.h1`
  color: purple;
  font-size: 30px;
`;

export default WeekContainer;
