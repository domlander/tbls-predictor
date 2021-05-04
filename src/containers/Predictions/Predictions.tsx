import React, { FormEvent, useState } from "react";
import styled from "styled-components";
import { useSession } from "next-auth/client";

import FixtureTable from "@/components/FixtureTable";
import { FixtureWithPrediction, UpdatePredictionsInputType } from "@/types";
import WeekNavigator from "@/components/molecules/WeekNavigator";
import { UPDATE_PREDICTIONS } from "apollo/mutations";
import { useMutation } from "@apollo/client";

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
  const [session] = useSession();
  const [processRequest] = useMutation(UPDATE_PREDICTIONS);
  const [predictions, setPredictions] = useState(fixtures);
  const thisWeeksPredictions = predictions.filter(
    (prediction) => prediction.gameweek === gameweek
  );

  const handleSubmitPredictions = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedPredictions: UpdatePredictionsInputType[] = predictions
      .filter((p) => p.gameweek === gameweek)
      .map((prediction) => ({
        userId: session?.user.id as number,
        fixtureId: prediction.fixtureId,
        homeGoals: parseInt(prediction.predictedHomeGoals || "") ?? null,
        awayGoals: parseInt(prediction.predictedAwayGoals || "") ?? null,
        big_boy_bonus: false,
      }));

    processRequest({ variables: { input: updatedPredictions } });
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
