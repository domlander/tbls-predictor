import React, { FormEvent, useState } from "react";
import styled from "styled-components";
import { useSession } from "next-auth/client";

import PredictionsTable from "@/components/PredictionsTable";
import { FixtureWithPrediction, UpdatePredictionsInputType } from "@/types";
import WeekNavigator from "@/components/molecules/WeekNavigator";
import { UPDATE_PREDICTIONS_MUTATION } from "apollo/mutations";
import { useMutation, useQuery } from "@apollo/client";
import { PREDICTIONS_QUERY } from "apollo/queries";
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

  const [
    processRequest,
    { data: mutationData, loading: mutationLoading, error: mutationError },
  ] = useMutation(UPDATE_PREDICTIONS_MUTATION);

  const { loading: queryLoading, error: queryError } = useQuery(
    PREDICTIONS_QUERY,
    {
      variables: { input: { userId, weekId } },
      onCompleted: ({ predictions: predictionsData }) => {
        setPredictions(predictionsData.fixturesWithPredictions);
        setGameweek(predictionsData.thisGameweek);
        setFirstGameweek(predictionsData.firstGameweek);
        setLastGameweek(predictionsData.lastGameweek);
      },
    }
  );

  const thisWeeksPredictions = predictions.filter(
    (prediction) => prediction.gameweek === gameweek
  );

  const handleSubmitPredictions = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedPredictions: UpdatePredictionsInputType[] = predictions
      .filter((p) => p.gameweek === gameweek)
      .map((prediction) => ({
        userId: session?.user.id as number,
        fixtureId: prediction.fixtureId,
        homeGoals: parseInt(prediction.predictedHomeGoals || "") ?? null,
        awayGoals: parseInt(prediction.predictedAwayGoals || "") ?? null,
        big_boy_bonus: prediction.big_boy_bonus,
      }));

    await processRequest({
      variables: { input: updatedPredictions },
    });
  };

  const updateGoals = (
    fixtureId: number,
    isHomeTeam: boolean,
    goals: string
  ): void => {
    const matchSingleDigitOrEmptyStringRegex = /^$|^[0-9]$/;

    // Input is invalid
    if (!matchSingleDigitOrEmptyStringRegex.test(goals)) return;

    // Make a copy of current state
    const updatedPredictions: FixtureWithPrediction[] = JSON.parse(
      JSON.stringify(predictions)
    );

    // Find the predicted we've changed
    const editedPrediction = updatedPredictions.find(
      (prediction: FixtureWithPrediction) => prediction.fixtureId === fixtureId
    );
    if (!editedPrediction) return;

    const predictedGoals: string | null = goals === "" ? null : goals;
    if (isHomeTeam) {
      editedPrediction.predictedHomeGoals = predictedGoals;
    } else {
      editedPrediction.predictedAwayGoals = predictedGoals;
    }

    setPredictions(updatedPredictions);
  };

  const updateBigBoyBonus = (fixtureId: number) => {
    // Make a copy of current state
    const updatedPredictions: FixtureWithPrediction[] = JSON.parse(
      JSON.stringify(predictions)
    );

    // Find the predicted we've changed
    const editedPrediction = updatedPredictions.find(
      (prediction: FixtureWithPrediction) => prediction.fixtureId === fixtureId
    );
    if (!editedPrediction) return;

    // Find the old fixture with big boy bonus and reset
    const oldBbb = updatedPredictions
      .filter((x) => x.gameweek === editedPrediction.gameweek)
      .find((x) => x.big_boy_bonus);

    if (oldBbb) oldBbb.big_boy_bonus = false;

    // Set the new choice to the big boy bonus
    editedPrediction.big_boy_bonus = true;

    setPredictions(updatedPredictions);
  };

  if (queryLoading) return <Loading />;
  if (queryError)
    return <div>An error has occurred. Please try again later.</div>;

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
      <PredictionsTable
        predictions={thisWeeksPredictions}
        updateGoals={updateGoals}
        handleSubmit={handleSubmitPredictions}
        handleBbbUpdate={updateBigBoyBonus}
        isSaved={!!mutationData?.updatePredictions}
        isSaving={mutationLoading}
        isSaveError={!!mutationError}
      />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

export default PredictionsContainer;
