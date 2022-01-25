import React, { FormEvent, useState } from "react";
import styled from "styled-components";
import { useSession } from "next-auth/client";

import { UPDATE_PREDICTIONS_MUTATION } from "apollo/mutations";
import { useMutation, useQuery } from "@apollo/client";
import { PREDICTIONS_QUERY } from "apollo/queries";
import combineFixturesAndPredictions from "utils/combineFixturesAndPredictions";
import Prediction from "src/types/Prediction";
import Fixture from "src/types/Fixture";
import User from "src/types/User";
import FixtureWithPrediction from "src/types/FixtureWithPrediction";
import PredictionsTable from "@/components/PredictionsTable";
import WeekNavigator from "@/components/molecules/WeekNavigator";

type UpdatePredictionsInputType = {
  userId: User["id"];
  fixtureId: Fixture["id"];
  homeGoals: Prediction["homeGoals"];
  awayGoals: Prediction["awayGoals"];
  big_boy_bonus: Prediction["big_boy_bonus"];
};

interface Props {
  fixtures: Fixture[];
  weekId: number;
  firstGameweek?: number;
  lastGameweek?: number;
}

const Predictions = ({
  fixtures,
  weekId: gameweek,
  firstGameweek,
  lastGameweek,
}: Props) => {
  const [session] = useSession();
  const userId = session?.user?.id;
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  const [
    processRequest,
    { data: mutationData, loading: mutationLoading, error: mutationError },
  ] = useMutation(UPDATE_PREDICTIONS_MUTATION);

  const { loading: isQueryLoading, error: isQueryError } = useQuery(
    PREDICTIONS_QUERY,
    {
      variables: { weekId: gameweek },
      onCompleted: ({ predictions: data }) => {
        setPredictions(data);
      },
      skip: !userId,
    }
  );

  const handleSubmitPredictions = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId) return;

    const updatedPredictions: UpdatePredictionsInputType[] = predictions.map(
      (prediction) => ({
        userId,
        fixtureId: prediction.fixtureId,
        homeGoals: parseInt(prediction.homeGoals?.toString() || "") ?? null,
        awayGoals: parseInt(prediction.awayGoals?.toString() || "") ?? null,
        big_boy_bonus: prediction.big_boy_bonus,
      })
    );

    await processRequest({
      variables: { input: updatedPredictions },
      update: (cache, { data }) => {
        cache.writeQuery({
          query: PREDICTIONS_QUERY,
          variables: { weekId: gameweek },
          data: {
            predictions: [...data.updatePredictions.predictions],
          },
        });
      },
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
    const updatedPredictions: Prediction[] = JSON.parse(
      JSON.stringify(predictions)
    );

    const predictedGoals = goals === "" ? null : parseInt(goals);

    // Find the predicted we've changed
    const editedPrediction = updatedPredictions.find(
      (prediction) => prediction.fixtureId === fixtureId
    );

    if (!editedPrediction) {
      updatedPredictions.push({
        fixtureId,
        userId: session!.user!.id,
        homeGoals: isHomeTeam ? predictedGoals : null,
        awayGoals: !isHomeTeam ? predictedGoals : null,
        big_boy_bonus: false,
        score: null,
      });
    } else {
      // prediction exists
      if (isHomeTeam) {
        editedPrediction.homeGoals = predictedGoals;
      } else {
        editedPrediction.awayGoals = predictedGoals;
      }
    }

    setPredictions(updatedPredictions);
  };

  const updateBigBoyBonus = (fixtureId: number) => {
    // Make a copy of current state
    const updatedPredictions: Prediction[] = JSON.parse(
      JSON.stringify(predictions)
    );

    // Find the predicted we've changed
    const editedPrediction = updatedPredictions.find(
      (prediction) => prediction.fixtureId === fixtureId
    );
    if (!editedPrediction) return;

    // Find the old fixture with big boy bonus and reset
    const oldBbb = updatedPredictions.find(
      ({ big_boy_bonus }) => big_boy_bonus
    );
    if (oldBbb) oldBbb.big_boy_bonus = false;

    // Set the new choice to the big boy bonus
    editedPrediction.big_boy_bonus = true;

    setPredictions(updatedPredictions);
  };

  if (isQueryError)
    return <div>An error has occurred. Please try again later.</div>;
  if (!fixtures.length)
    return <div>No fixtures found for gameweek {gameweek}</div>;

  console.log({ predictions });
  const fixturesWithPredictions: FixtureWithPrediction[] =
    combineFixturesAndPredictions(fixtures, predictions);

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
        predictions={fixturesWithPredictions}
        updateGoals={updateGoals}
        handleSubmit={handleSubmitPredictions}
        handleBbbUpdate={updateBigBoyBonus}
        isLoading={isQueryLoading}
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

export default Predictions;
