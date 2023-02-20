import React, { FormEvent, Fragment, useEffect, useState } from "react";
import styled from "styled-components";
import { calculateGameweekScore } from "utils/calculateGameweekScore";
import isPastDeadline from "utils/isPastDeadline";
import {
  formatFixtureKickoffTime,
  whenIsTheFixture,
} from "utils/kickoffDateHelpers";
import useTransientState from "src/hooks/useTransientState";
import FixtureWithPrediction from "src/types/FixtureWithPrediction";
import colours from "src/styles/colours";
import pageSizes from "src/styles/pageSizes";
import Button from "src/components/Button";
import GridRow from "src/components/GridRow";
import TeamFixtures from "src/types/TeamFixtures";
import GridRowForm from "../GridRowForm";

const StateFeedback = {
  LOADING: "Loading...",
  SAVING: "Saving...",
  IDLE: "",
  SAVE_SUCCESS: "Predictions updated!",
  SAVE_FAILED:
    "There was an error updating your predictions. Please try again.",
};

interface Props {
  predictions: FixtureWithPrediction[];
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
  const [displayStats, setDisplayStats] = useState(false);
  const gameweekScore = calculateGameweekScore(predictions);

  useEffect(() => {
    if (!isSaving && (isSaved || isSaveError)) {
      setShowFeedback(true);
    }
  }, [isSaving, isSaved]);

  if (!predictions?.length) return null;

  const firstFixtureKickoffTiming = whenIsTheFixture(predictions[0].kickoff);

  let state: keyof typeof StateFeedback;
  if (isLoading) state = "LOADING";
  else if (isSaving) state = "SAVING";
  else if (showFeedback && isSaveError) state = "SAVE_FAILED";
  else if (showFeedback) state = "SAVE_SUCCESS";
  else state = "IDLE";

  const isBbbLockedForGameweek = predictions.some(
    ({ bigBoyBonus, kickoff }) => bigBoyBonus && isPastDeadline(kickoff)
  );

  return (
    <Container>
      <StatsToggleContainer>
        <StatsToggle
          variant="secondary"
          handleClick={() => setDisplayStats(!displayStats)}
        >
          {displayStats ? "Hide stats" : "Show stats"}
        </StatsToggle>
      </StatsToggleContainer>
      <form onSubmit={handleSubmit}>
        <Table displayStats={displayStats}>
          {predictions.map(
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
                          <span>
                            FT {homeGoals} - {awayGoals}
                          </span>
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
                    predictionScore={predictionScore || undefined}
                    locked={isLoading || isLocked}
                    topRow={i === 0}
                    handleBbbUpdate={handleBbbUpdate}
                  />
                  {displayStats && (
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
        predictions.some(
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

  @media (max-width: ${pageSizes.tablet}) {
    display: none;
  }
`;

const Table = styled.div<{ displayStats: boolean }>`
  display: grid;
  grid-template-columns: 11em 0.8fr auto 5px auto 1fr;
  grid-auto-rows: ${({ displayStats }) =>
    displayStats ? "4.8em 1fr" : "4.8em"};

  @media (max-width: ${pageSizes.tablet}) {
    grid-template-columns: 7em 0.8fr auto 5px auto 1fr;
    grid-auto-rows: 3em;
  }

  @media (max-width: ${pageSizes.mobileM}) {
    grid-template-columns: 6em 0.8fr auto 5px auto 1fr;
  }

  > div,
  input {
    font-size: 2em;
    @media (max-width: ${pageSizes.tablet}) {
      font-size: 1.2em;
    }
    @media (max-width: ${pageSizes.mobileL}) {
      font-size: 1.1em;
    }
    @media (max-width: ${pageSizes.mobileM}) {
      font-size: 1em;
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

  span:nth-child(2) {
    display: flex;
    align-items: center;
    font-size: 1rem;
    color: ${colours.grey600};

    @media (max-width: ${pageSizes.tablet}) {
      font-size: 0.7rem;
    }

    @media (max-width: ${pageSizes.mobileL}) {
      font-size: 0.5rem;
    }

    @media (max-width: ${pageSizes.mobileM}) {
      display: none;
    }
  }
`;

const UserFeedback = styled.p`
  order: 2;
  color: ${colours.cyan300};
  font-size: 1.8em;
  font-style: italic;
  margin: 0;

  @media (max-width: ${pageSizes.tablet}) {
    margin-top: 1em;
  }
`;

const GameweekScore = styled.p`
  color: ${colours.grey400};
  margin: 1.4rem 0 0 1rem;
  font-size: 2em;

  @media (max-width: ${pageSizes.tablet}) {
    margin: 1rem 0 0 0.7rem;
    font-size: 1rem;
  }

  @media (max-width: ${pageSizes.mobileM}) {
    margin: 0.8rem 0 0 0.5rem;
    font-size: 0.8rem;
  }
`;

export default PredictionsTable;
