"use client";

import { FormEvent, Fragment, useEffect, useState } from "react";
import styled from "styled-components";

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
    <Container>
      <StatsToggleContainer>
        <StatsToggle
          variant="secondary"
          handleClick={() => setDisplayForm(!displayForm)}
        >
          {displayForm ? "Hide team form" : "Show team form"}
        </StatsToggle>
      </StatsToggleContainer>
      <form onSubmit={handleSubmit}>
        <Table $displayStats={displayForm}>
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
                        <AwayTeam>
                          <span>{awayTeam}</span>
                          <FullTimeResult className={chivoMono.className}>
                            <span>FT</span>
                            <span>
                              {homeGoals}-{awayGoals}
                            </span>
                          </FullTimeResult>
                        </AwayTeam>
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
                    isLoading={state === "LOADING"}
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
        </Table>
        {isAlwaysEditable ||
        fixturesWithPredictions.some(
          (prediction) => !isPastDeadline(prediction.kickoff)
        ) ? (
          <ButtonsAndMessageContainer>
            <ButtonContainer>
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
            </ButtonContainer>
            {state !== "LOADING" && state !== "SAVING" ? (
              <UserFeedback>{StateFeedback[state]}</UserFeedback>
            ) : (
              <span />
            )}
          </ButtonsAndMessageContainer>
        ) : gameweekScore !== null ? (
          <GameweekScore>{`Result: ${gameweekScore} points`}</GameweekScore>
        ) : null}
      </form>
    </Container>
  );
};

const Container = styled.article``;

const StatsToggleContainer = styled.div`
  width: max-content;
`;

const StatsToggle = styled(Button)`
  font-size: 0.9rem !important;
  margin-bottom: 0.4em;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Table = styled.div<{ $displayStats: boolean }>`
  display: grid;
  grid-template-columns: 11em 0.8fr auto 5px auto 1fr;
  grid-auto-rows: ${({ $displayStats }) =>
    $displayStats ? "4.8em 1fr" : "4.8em"};

  @media (max-width: 768px) {
    grid-template-columns: 7em 0.8fr auto 5px auto 1fr;
    grid-auto-rows: 3.8em;
  }

  @media (max-width: 480px) {
    grid-template-columns: 6em 0.8fr auto 4px auto 1fr;
    grid-auto-rows: 3.4em;
  }

  @media (max-width: 375px) {
    grid-template-columns: 5em 0.8fr auto 2px auto 1fr;
    grid-auto-rows: 2.8em;
  }

  > div {
    font-size: 1.8em;
    @media (max-width: 768px) {
      font-size: 1.4em;
    }
    @media (max-width: 480px) {
      font-size: 1.2em;
    }
    @media (max-width: 375px) {
      font-size: 0.9em;
    }
  }

  input {
    font-size: 2em;
    @media (max-width: 768px) {
      font-size: 1.6em;
    }
    @media (max-width: 480px) {
      font-size: 1.4em;
    }
    @media (max-width: 375px) {
      font-size: 1.1em;
    }
  }
`;

const ButtonsAndMessageContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 1.6rem;

  @media (max-width: 650px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const ButtonContainer = styled.div`
  order: 3;

  @media (max-width: 650px) {
    order: 1;
    flex-basis: auto;
  }
`;

const AwayTeam = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const FullTimeResult = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5em;
  font-size: 1rem;
  color: var(--grey600);

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
  @media (max-width: 480px) {
    font-size: 0.6rem;
  }
  @media (max-width: 375px) {
    display: none;
  }
`;

const UserFeedback = styled.p`
  order: 2;
  color: var(--cyan300);
  font-size: 1.8em;
  font-style: italic;
  margin: 0;

  @media (max-width: 768px) {
    margin-top: 1em;
  }
`;

const GameweekScore = styled.p`
  color: var(--grey400);
  margin: 1.4rem 0 0 1rem;
  font-size: 2em;

  @media (max-width: 768px) {
    margin: 1rem 0 0 0.7rem;
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    margin: 0.8rem 0 0 0.5rem;
    font-size: 0.8rem;
  }
`;

export default PredictionsTable;
