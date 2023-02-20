import React, { FormEvent, useState } from "react";
import styled from "styled-components";
import { useSession } from "next-auth/react";
import Link from "next/link";

import { UPDATE_PREDICTIONS_MUTATION } from "apollo/mutations";
import { useMutation, useQuery } from "@apollo/client";
import { PREDICTIONS_QUERY } from "apollo/queries";
import combineFixturesAndPredictions from "utils/combineFixturesAndPredictions";
import WeekNavigator from "src/components/WeekNavigator";
import PredictionsTable from "src/components/PredictionsTable";
import colours from "src/styles/colours";
import type Fixture from "src/types/Fixture";
import type FixtureWithPrediction from "src/types/FixtureWithPrediction";
import type Prediction from "src/types/Prediction";
import type TeamFixtures from "src/types/TeamFixtures";
import type User from "src/types/User";

type UpdatePredictionsInputType = {
  userId: User["id"];
  fixtureId: Fixture["id"];
  homeGoals: Prediction["homeGoals"];
  awayGoals: Prediction["awayGoals"];
  bigBoyBonus: Prediction["bigBoyBonus"];
  score: Prediction["score"];
};

interface Props {
  fixtures: Fixture[];
  weekId: number;
  recentFixturesByTeam: TeamFixtures[];
  firstGameweek?: number;
  lastGameweek?: number;
}

const Predictions = ({
  fixtures,
  weekId: gameweek,
  recentFixturesByTeam,
  firstGameweek,
  lastGameweek,
}: Props) => {
  const { data: session } = useSession();
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
      onCompleted: (data) => {
        setPredictions(data.predictions);
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
        bigBoyBonus: prediction.bigBoyBonus,
        score: prediction.score ?? null,
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
        user: { id: session!.user.id },
        homeGoals: isHomeTeam ? predictedGoals : null,
        awayGoals: !isHomeTeam ? predictedGoals : null,
        bigBoyBonus: false,
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
    const oldBbb = updatedPredictions.find(({ bigBoyBonus }) => bigBoyBonus);
    if (oldBbb) oldBbb.bigBoyBonus = false;

    // Set the new choice to the big boy bonus
    editedPrediction.bigBoyBonus = true;

    setPredictions(updatedPredictions);
  };

  if (isQueryError)
    return <p>An error has occurred. Please try again later.</p>;

  if (!fixtures?.length)
    return (
      <NoFixtures>
        <p>No fixtures found for gameweek {gameweek}</p>
        <p>
          Go to <Link href="/predictions">this weeks predictions</Link>
        </p>
      </NoFixtures>
    );

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
        recentFixturesByTeam={recentFixturesByTeam}
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

const Container = styled.section`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  max-width: 800px;
`;

const NoFixtures = styled.section`
  p {
    font-size: 1rem;
  }

  a {
    text-decoration: underline;
    text-underline-offset: 3px;

    :hover,
    :focus {
      color: ${colours.cyan100};
    }
  }
`;

export default Predictions;
