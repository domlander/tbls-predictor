import React, { FormEvent, useState } from "react";
import styled from "styled-components";
import Link from "next/link";

import FixtureTable from "@/components/FixtureTable";
import { EditablePrediction } from "@/types";
import { Fixture, League, Prediction } from "@prisma/client";
import WeekNavigator from "@/components/molecules/WeekNavigator";
import colours from "@/styles/colours";

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
        kickoff: prediction.kickoff,
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
      <LeagueNameContainer>
        <Link href={`/league/${leagueId}/table`}>
          <A>{name}</A>
        </Link>
      </LeagueNameContainer>
      {isUserLeagueAdmin && (
        <div>
          <Link href={`/league/${leagueId}/admin`}>
            <a>Admin</a>
          </Link>
        </div>
      )}
      <WeekNavigator
        week={gameweek}
        prevGameweekUrl={
          gameweek !== 1
            ? `/league/${leagueId}/week/${gameweek - 1}`
            : undefined
        }
        nextGameweekUrl={
          gameweek < gameweekEnd - gameweekStart + 1
            ? `/league/${leagueId}/week/${gameweek + 1}`
            : undefined
        }
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

const LeagueNameContainer = styled.div`
  background-color: ${colours.grey400};
  margin-top: 16px;
  width: fit-content;
  position: relative;
  left: -8px;
  padding: 6px 12px 6px 6px;
  border-radius: 0 16px 16px 0;
`;

const A = styled.a`
  color: ${colours.blackblue400};
  font-size: 1.4em;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: calc(100% - 16px);
  margin-left: 8px;
`;

export default WeekContainer;
