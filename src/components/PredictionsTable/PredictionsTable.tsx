"use client";

import { FormEvent, Fragment, useEffect, useState } from "react";

import { chivoMono } from "app/fonts";
import { calculateGameweekScore } from "utils/calculateGameweekScore";
import isPastDeadline from "utils/isPastDeadline";
import {
  formatFixtureKickoffTime,
  whenIsTheFixture,
} from "utils/kickoffDateHelpers";
import useTransientState from "src/hooks/useTransientState";
import FixtureWithPrediction from "src/types/FixtureWithPrediction";
import Button from "src/components/Button";
import Fixture from "src/types/Fixture";
import GridRow from "src/components/GridRow";
import Prediction from "src/types/Prediction";
import TeamFixtures from "src/types/TeamFixtures";
import combineFixturesAndPredictions from "utils/combineFixturesAndPredictions";
import GridRowForm from "../GridRowForm";
import styles from "./PredictionsTable.module.css";

const StateFeedback = {
  LOADING: "Loading predictions...",
  SAVING: "Saving...",
  IDLE: "",
  SAVE_SUCCESS: "Predictions updated!",
  SAVE_FAILED:
    "There was an error updating your predictions. Please try again.",
};

interface Props {
  fixtures: Fixture[];
  predictions: Prediction[] | null;
  recentFixturesByTeam: TeamFixtures[];
  updateGoals: (
    fixtureId: number,
    isHomeTeam: boolean,
    homeGoals: string
  ) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  handleBbbUpdate: (fixtureId: number) => void;
  isAlwaysEditable?: boolean;
  isLoading?: boolean;
  isSaving?: boolean;
  isSaved?: boolean;
  isSaveError?: boolean;
}

const PredictionsTable = ({
  fixtures,
  predictions,
  recentFixturesByTeam,
  updateGoals,
  handleSubmit,
  handleBbbUpdate,
  isAlwaysEditable = false,
  isLoading = false,
  isSaving = false,
  isSaved = false,
  isSaveError = false,
}: Props) => {
  const [showFeedback, setShowFeedback] = useTransientState(false, 3000);
  const [displayForm, setDisplayForm] = useState(false);

  useEffect(() => {
    if (!isSaving && (isSaved || isSaveError)) {
      setShowFeedback(true);
    }
  }, [isSaving, isSaved]);

  if (!fixtures?.length) return null;

  let state: keyof typeof StateFeedback;
  if (isLoading) state = "LOADING";
  else if (isSaving) state = "SAVING";
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

  return (
    <article>
      <div className={styles.statsToggleContainer}>
        <Button
          variant="secondary"
          handleClick={() => setDisplayForm(!displayForm)}
          size="small"
        >
          {displayForm ? "Hide team form" : "Show team form"}
        </Button>
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

              const isLocked = !isAlwaysEditable && isPastDeadline(kickoff);
              const defaultGoals = isLocked && !isLoading ? "0" : "";

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
                    locked={!predictions || isLoading || isLocked}
                    topRow={i === 0}
                    handleBbbUpdate={handleBbbUpdate}
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
        {isAlwaysEditable ||
        fixturesWithPredictions.some(
          (prediction) => !isPastDeadline(prediction.kickoff)
        ) ? (
          <div className={styles.buttonsAndMessageContainer}>
            <div className={styles.buttonContainer}>
              <Button
                id="save"
                type="submit"
                variant="primary"
                disabled={state === "LOADING" || state === "SAVING"}
              >
                {state === "LOADING" || state === "SAVING"
                  ? StateFeedback[state]
                  : "Save predictions"}
              </Button>
            </div>
            {state !== "LOADING" && state !== "SAVING" ? (
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

export default PredictionsTable;
