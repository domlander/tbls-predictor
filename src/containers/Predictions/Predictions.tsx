"use client";

import { FormEvent, useEffect, useState } from "react";
import styled from "styled-components";
import { useSession } from "next-auth/react";
import Link from "next/link";

import WeekNavigator from "src/components/WeekNavigator";
import PredictionsTable from "src/components/PredictionsTable";
import colours from "src/styles/colours";
import type Fixture from "src/types/Fixture";
import type Prediction from "src/types/Prediction";
import type TeamFixtures from "src/types/TeamFixtures";
import type User from "src/types/User";

export type UpdatePredictionsInputType = {
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
  weekId,
  recentFixturesByTeam,
  firstGameweek,
  lastGameweek,
}: Props) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaveError, setIsSaveError] = useState(false);
  const [predictions, setPredictions] = useState<Prediction[] | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
    fetch(`/api/userPredictions?weekId=${weekId}`)
      .then((res) => {
        if (res.status !== 200) {
          throw new Error();
        }
        return res.json();
      })
      .then((data) => {
        setPredictions(data.predictions);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        setIsError(true);
      });
  }, [weekId]);

  const handleSubmitPredictions = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId || !predictions) return;

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

    setIsSaving(true);
    setIsSaved(false);
    fetch("/api/updatePredictions", {
      method: "POST",
      body: JSON.stringify({ predictions: updatedPredictions }),
    }).then((res) => {
      setIsSaving(false);
      if (!res.ok) {
        setIsSaveError(true);
      } else {
        setIsSaved(true);
      }
    });
  };

  const updateGoals = (
    fixtureId: number,
    isHomeTeam: boolean,
    goals: string
  ): void => {
    if (!predictions || !userId) return;

    // Make a copy of current state
    const updatedPredictions: Prediction[] = JSON.parse(
      JSON.stringify(predictions)
    );

    const predictedGoals = goals === "" ? null : parseInt(goals);

    // Find the predicted we've changed
    const editedPrediction = updatedPredictions.find(
      (prediction) => prediction.fixtureId === fixtureId
    );

    // prediction doesn't yet exist
    if (!editedPrediction) {
      updatedPredictions.push({
        fixtureId,
        user: { id: userId },
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
    if (!predictions) return;

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

  if (isError) return <p>An error has occurred. Please try again later.</p>;

  if (!fixtures?.length)
    return (
      <NoFixtures>
        <p>No fixtures found for gameweek {weekId}</p>
        <p>
          Go to <Link href="/predictions">this weeks predictions</Link>
        </p>
      </NoFixtures>
    );

  return (
    <Container>
      {weekId && firstGameweek && lastGameweek && (
        <WeekNavigator
          week={weekId}
          prevGameweekUrl={
            weekId === firstGameweek ? undefined : `/predictions/${weekId - 1}`
          }
          nextGameweekUrl={
            weekId < lastGameweek - firstGameweek + 1
              ? `/predictions/${weekId + 1}`
              : undefined
          }
        />
      )}
      <PredictionsTable
        fixtures={fixtures}
        predictions={predictions}
        recentFixturesByTeam={recentFixturesByTeam}
        updateGoals={updateGoals}
        handleSubmit={handleSubmitPredictions}
        handleBbbUpdate={updateBigBoyBonus}
        isLoading={isLoading}
        isSaved={isSaved}
        isSaving={isSaving}
        isSaveError={isSaveError}
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

    &:hover,
    &:focus {
      color: ${colours.cyan100};
    }
  }
`;

export default Predictions;
