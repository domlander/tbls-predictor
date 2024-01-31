"use client";

import { FormEvent, Fragment, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import { chivoMono } from "app/fonts";
import updatePredictions from "src/actions/updatePredictions";
import useTransientState from "src/hooks/useTransientState";
import ShowTeamFormButton from "src/components/ShowTeamFormButton";
import type FixtureWithPrediction from "src/types/FixtureWithPrediction";
import GridRowForm from "src/components/GridRowForm";
import Button from "src/components/Button";
import type Fixture from "src/types/Fixture";
import GridRow from "src/components/GridRow";
import type User from "src/types/User";
import type Prediction from "src/types/Prediction";
import type TeamFixtures from "src/types/TeamFixtures";
import combineFixturesAndPredictions from "utils/combineFixturesAndPredictions";
import { calculateGameweekScore } from "utils/calculateGameweekScore";
import isPastDeadline from "utils/isPastDeadline";
import {
  formatFixtureKickoffTime,
  whenIsTheFixture,
} from "utils/kickoffDateHelpers";
import styles from "./PredictionsTable.module.css";

const StateFeedback = {
  SAVING: "Saving...",
  IDLE: "",
  SAVE_SUCCESS: "Predictions updated!",
  SAVE_FAILED:
    "There was an error updating your predictions. Please try again.",
};

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
  recentFixturesByTeam: TeamFixtures[];
}

const PredictionsForm = ({
  fixtures,
  recentFixturesByTeam,
  predictions: initialPredictions,
}: Props) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaveError, setIsSaveError] = useState(false);
  const [predictions, setPredictions] =
    useState<Prediction[]>(initialPredictions);
  const [showFeedback, setShowFeedback] = useTransientState(false, 3000);
  const [displayForm, setDisplayForm] = useState(false);

  useEffect(() => {
    if (!isSaving && (isSaved || isSaveError)) {
      setShowFeedback(true);
    }
  }, [isSaving, isSaved]);

  if (!fixtures?.length) return null;

  let state: keyof typeof StateFeedback;
  if (isSaving) state = "SAVING";
  else if (showFeedback && isSaveError) state = "SAVE_FAILED";
  else if (showFeedback) state = "SAVE_SUCCESS";
  else state = "IDLE";

  const fixturesWithPredictions: FixtureWithPrediction[] =
    combineFixturesAndPredictions(fixtures, predictions || []);

  const firstFixtureKickoffTiming = whenIsTheFixture(fixtures[0].kickoff);
  const gameweekScore = calculateGameweekScore(fixturesWithPredictions);
  const isBbbLockedForGameweek = fixturesWithPredictions.some(
    ({ bigBoyBonus, kickoff }) => bigBoyBonus && isPastDeadline(kickoff)
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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

  return (
    <article>
      <div className={styles.statsToggleContainer}>
        <ShowTeamFormButton
          displayForm={displayForm}
          setDisplayForm={setDisplayForm}
        />
      </div>
      <form onSubmit={handleSubmit}>
        <div
          className={[styles.table, displayForm && styles.displayForm].join(
            " "
          )}
        >
          {fixturesWithPredictions.map(
            (
              {
                fixtureId,
                kickoff,
                homeTeam,
                homeGoals,
                awayTeam,
                awayGoals,
                predictedHomeGoals,
                predictedAwayGoals,
                bigBoyBonus,
                predictionScore,
              },
              i
            ) => {
              const homeForm =
                recentFixturesByTeam?.find((rf) => rf.team === homeTeam)
                  ?.fixtures || [];
              const awayForm =
                recentFixturesByTeam?.find((rf) => rf.team === awayTeam)
                  ?.fixtures || [];

              const isLocked = isPastDeadline(kickoff);
              const defaultGoals = isLocked ? "0" : "";

              return (
                <Fragment key={fixtureId}>
                  <GridRow
                    fixtureId={fixtureId}
                    kickoff={formatFixtureKickoffTime(
                      kickoff,
                      firstFixtureKickoffTiming
                    )}
                    homeTeam={homeTeam}
                    awayTeam={
                      homeGoals !== null && awayGoals !== null ? (
                        <div className={styles.awayTeam}>
                          <span>{awayTeam}</span>
                          <span
                            className={[
                              chivoMono.className,
                              styles.fullTimeResult,
                            ].join(" ")}
                          >
                            <span>FT</span>
                            <span>
                              {homeGoals}-{awayGoals}
                            </span>
                          </span>
                        </div>
                      ) : (
                        <span>{awayTeam}</span>
                      )
                    }
                    homeGoals={predictedHomeGoals ?? defaultGoals}
                    awayGoals={predictedAwayGoals ?? defaultGoals}
                    updateGoals={updateGoals}
                    isBigBoyBonus={bigBoyBonus}
                    isBbbLocked={isBbbLockedForGameweek}
                    predictionScore={predictionScore ?? undefined}
                    isLoaded={!!predictions}
                    locked={!predictions || isLocked}
                    topRow={i === 0}
                    handleBbbUpdate={updateBigBoyBonus}
                  />
                  {displayForm && (
                    <GridRowForm
                      homeTeam={homeTeam}
                      awayTeam={awayTeam}
                      homeTeamForm={homeForm}
                      awayTeamForm={awayForm}
                    />
                  )}
                </Fragment>
              );
            }
          )}
        </div>
        {fixturesWithPredictions.some(
          (prediction) => !isPastDeadline(prediction.kickoff)
        ) ? (
          <div className={styles.buttonsAndMessageContainer}>
            <div className={styles.buttonContainer}>
              <Button
                id="save"
                type="submit"
                variant="primary"
                disabled={state === "SAVING"}
              >
                Save predictions
              </Button>
            </div>
            {state !== "SAVING" ? (
              <p className={styles.userFeedback}>{StateFeedback[state]}</p>
            ) : (
              <span />
            )}
          </div>
        ) : gameweekScore !== null ? (
          <p
            className={styles.gameweekScore}
          >{`Result: ${gameweekScore} points`}</p>
        ) : null}
      </form>
    </article>
  );
};

export default PredictionsForm;
