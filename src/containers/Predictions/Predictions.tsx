import React, { FormEvent, useState } from "react";
import styled from "styled-components";

import FixtureTable from "@/components/FixtureTable";
import { FixtureWithPrediction } from "@/types";
import { Prediction } from "@prisma/client";
import WeekNavigator from "@/components/molecules/WeekNavigator";

interface Props {
  gameweek: number;
  fixtures: FixtureWithPrediction[];
  firstGameweek: number;
  lastGameweek: number;
}

const PredictionsContainer = ({
  gameweek,
  firstGameweek,
  lastGameweek,
  fixtures,
}: Props) => {
  const [predictions, setPredictions] = useState(fixtures);
  const thisWeeksPredictions = predictions.filter(
    (prediction) => prediction.gameweek === gameweek
  );

  const handleSubmitPredictions = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedPredictions: Partial<Prediction>[] = predictions
      .filter((p) => p.gameweek === gameweek)
      .map((prediction) => ({
        fixtureId: prediction.fixtureId,
        homeGoals: parseInt(prediction.predictedHomeGoals || "") ?? null,
        awayGoals: parseInt(prediction.predictedAwayGoals || "") ?? null,
      }));

    fetch("/api/upsertPredictions", {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ updatedPredictions }),
    });
  };

  const updateGoals = (
    fixtureId: number,
    isHomeTeam: boolean,
    goals: string
  ): void => {
    if (goals !== "" && goals !== "0" && !parseInt(goals)) return;

    // Make a copy of current state
    const updatedPredictions: FixtureWithPrediction[] = JSON.parse(
      JSON.stringify(predictions)
    );

    // Find the predicted we've changed
    const editedPrediction = updatedPredictions.find(
      (prediction: FixtureWithPrediction) => prediction.fixtureId === fixtureId
    );
    if (!editedPrediction) return;

    if (isHomeTeam) {
      editedPrediction.predictedHomeGoals = goals;
    } else {
      editedPrediction.predictedAwayGoals = goals;
    }

    setPredictions(updatedPredictions);
  };

  return (
    <Container>
      <WeekNavigator
        week={gameweek}
        prevGameweekUrl={
          gameweek === firstGameweek
            ? undefined
            : `/predictions/${gameweek - 1}`
        }
        nextGameweekUrl={
          gameweek < lastGameweek - firstGameweek + 1
            ? `/predictions/${gameweek + 1}`
            : undefined
        }
      />
      <FixtureTable
        predictions={thisWeeksPredictions}
        updateGoals={updateGoals}
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
