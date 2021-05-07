import React, { FormEvent, useState } from "react";
import styled from "styled-components";
import { useSession } from "next-auth/client";

import FixtureTable from "@/components/FixtureTable";
import { FixtureWithPrediction, UpdatePredictionsInputType } from "@/types";
import WeekNavigator from "@/components/molecules/WeekNavigator";
import { UPDATE_PREDICTIONS } from "apollo/mutations";
import { useMutation, useQuery } from "@apollo/client";
import { PREDICTIONS } from "apollo/queries";
import Loading from "@/components/atoms/Loading";

interface Props {
  userId: number;
  weekId: number;
}

const PredictionsContainer = ({ userId, weekId }: Props) => {
  const [session] = useSession();

  const [predictions, setPredictions] = useState<FixtureWithPrediction[]>([]);
  const [gameweek, setGameweek] = useState<number>();
  const [firstGameweek, setFirstGameweek] = useState<number>();
  const [lastGameweek, setLastGameweek] = useState<number>();

  const [processRequest] = useMutation(UPDATE_PREDICTIONS);

  const { loading, error } = useQuery(PREDICTIONS, {
    variables: { input: { userId, weekId } },
    onCompleted: ({ predictions: predictionsData }) => {
      setPredictions(predictionsData.fixturesWithPredictions);
      setGameweek(predictionsData.thisGameweek);
      setFirstGameweek(predictionsData.firstGameweek);
      setLastGameweek(predictionsData.lastGameweek);
    },
  });

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

  if (loading) return <Loading />;
  if (error) return <div>An error has occurred. Please try again later.</div>;

  return (
    <Container>
      {gameweek && firstGameweek && lastGameweek && (
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
      )}
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
