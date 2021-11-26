import React, { FormEvent, useState } from "react";
import styled from "styled-components";
import { useSession } from "next-auth/client";

import PredictionsTable from "@/components/PredictionsTable";
import { FixtureWithPrediction, UpdatePredictionsInputType } from "@/types";
import WeekNavigator from "@/components/molecules/WeekNavigator";
import { UPDATE_PREDICTIONS } from "apollo/mutations";
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

  const [isSaveError, setIsSaveError] = useState(false);

  const [processRequest] = useMutation(UPDATE_PREDICTIONS);

  const { loading, error } = useQuery(PREDICTIONS_QUERY, {
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

    const isSuccess = await processRequest({
      variables: { input: updatedPredictions },
    });

    if (isSuccess) setIsSaveError(false);
    else setIsSaveError(true);
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
      <PredictionsTable
        predictions={thisWeeksPredictions}
        updateGoals={updateGoals}
        handleSubmit={handleSubmitPredictions}
        isErrorOnUpdate={isSaveError}
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
