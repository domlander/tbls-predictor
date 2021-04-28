import React, { FormEvent, useState } from "react";
import styled from "styled-components";

import FixtureTable from "@/components/FixtureTable";
import { EditablePrediction } from "@/types";
import { Fixture, Prediction } from "@prisma/client";
import WeekNavigator from "@/components/molecules/WeekNavigator";

interface Props {
  gameweek: number;
  fixtures: Fixture[];
  initialPredictions: EditablePrediction[];
}

const PredictionsContainer = ({
  gameweek,
  fixtures,
  initialPredictions,
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

  // TODO - when we have Apollo cache, get user's most recent league from cache. Default to weeks 1-38
  const gameweekStart = 1;
  const gameweekEnd = 4;

  return (
    <Container>
      <WeekNavigator
        week={gameweek}
        prevGameweekUrl={
          gameweek !== 1 ? `/predictions/${gameweek - 1}` : undefined
        }
        nextGameweekUrl={
          gameweek < gameweekEnd - gameweekStart + 1
            ? `/predictions/${gameweek + 1}`
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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: calc(100% - 16px);
  margin-left: 8px;
`;

export default PredictionsContainer;
