"use client";

import { FormEvent, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

import WeekNavigator from "src/components/WeekNavigator";
import PredictionsTable from "src/components/PredictionsTable";
import type Fixture from "src/types/Fixture";
import type Prediction from "src/types/Prediction";
import type TeamFixtures from "src/types/TeamFixtures";
import type User from "src/types/User";
import updatePredictions from "src/actions/updatePredictions";
import styles from "./Predictions.module.css";

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
  predictions: Prediction[];
  weekId: number;
  recentFixturesByTeam: TeamFixtures[];
  firstGameweek?: number;
  lastGameweek?: number;
}

const Predictions = ({
  fixtures,
  predictions: initialPredictions,
  weekId,
  recentFixturesByTeam,
  firstGameweek,
  lastGameweek,
}: Props) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaveError, setIsSaveError] = useState(false);
  const [predictions, setPredictions] =
    useState<Prediction[]>(initialPredictions);

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

    updatePredictions(updatedPredictions).then(({ success }) => {
      setIsSaving(false);
      if (!success) {
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
    if (!predictions) return;

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

  if (!fixtures?.length)
    return (
      <section className={styles.noFixtures}>
        <p>No fixtures found for gameweek {weekId}</p>
        <p>
          Go to{" "}
          <Link className={styles.noFixturesLink} href="/predictions">
            this weeks predictions
          </Link>
        </p>
      </section>
    );

  return (
    <div className={styles.container}>
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
        isSaved={isSaved}
        isSaving={isSaving}
        isSaveError={isSaveError}
      />
    </div>
  );
};

export default Predictions;
