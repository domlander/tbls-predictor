import React, { FormEvent, useState } from "react";
import styled from "styled-components";
import Link from "next/link";

import Header from "@/components/Header";
import FixtureTable from "@/components/FixtureTable";
import GameweekNavigator from "@/components/GameweekNavigator";
import { EditablePrediction } from "@/types";
import { Fixture, League, Prediction } from "@prisma/client";

interface Props {
  league: League;
  gameweek: number;
  fixtures: Fixture[];
  initialPredictions: EditablePrediction[];
  isUserLeagueAdmin: boolean;
}

const WeekContainer = ({
  league: { id: leagueId, name, gameweekStart, gameweekEnd },
  gameweek,
  fixtures,
  initialPredictions,
  isUserLeagueAdmin,
}: Props) => {
  const [predictions, setPredictions] = useState(initialPredictions);

  const handleSubmitPredictions = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedPredictions: Partial<Prediction>[] = predictions.map(
      (prediction) => ({
        fixtureId: prediction.fixtureId,
        homeGoals: parseInt(prediction.homeGoals || "") ?? null,
        awayGoals: parseInt(prediction.awayGoals || "") ?? null,
      })
    );

    fetch("/api/upsertPredictions", {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ updatedPredictions }),
    });
  };

  return (
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
      <FixtureTable
        fixtures={fixtures}
        predictions={predictions}
        setPredictions={setPredictions}
        handleSubmit={handleSubmitPredictions}
      />
    </Container>
  );
};

const Container = styled.div``;

const Title = styled.h1`
  color: purple;
  font-size: 30px;
`;

export default WeekContainer;
