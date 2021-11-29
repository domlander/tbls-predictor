import React, { FormEvent, useEffect } from "react";
import styled from "styled-components";

import { FixtureWithPrediction } from "@/types";
import { calculateGameweekScore } from "utils/calculateGameweekScore";
import isPastDeadline from "utils/isPastDeadline";
import {
  formatFixtureKickoffTime,
  whenIsTheFixture,
} from "utils/kickoffDateHelpers";
import useTransientState from "src/hooks/useTransientState";
import Button from "../Button";
import GridRow from "../molecules/GridRow";
import colours from "../../styles/colours";
import pageSizes from "../../styles/pageSizes";

type SAVING_STATE = "IDLE" | "SAVING" | "SUCCESS" | "FAILED";

interface Props {
  predictions: FixtureWithPrediction[];
  updateGoals: (
    fixtureId: number,
    isHomeTeam: boolean,
    homeGoals: string
  ) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  handleBbbUpdate: (fixtureId: number) => void;
  isAlwaysEditable?: boolean;
  isSaving?: boolean;
  isSaved?: boolean;
  isSaveError?: boolean;
}

const PredictionsTable = ({
  predictions,
  updateGoals,
  handleSubmit,
  handleBbbUpdate,
  isAlwaysEditable = false,
  isSaving = false,
  isSaved = false,
  isSaveError = false,
}: Props) => {
  const [showFeedback, setShowFeedback] = useTransientState(false, 3000);
  const gameweekScore = calculateGameweekScore(predictions);

  useEffect(() => {
    if (!isSaving && (isSaved || isSaveError)) setShowFeedback(true);
  }, [isSaving, isSaved]);

  if (!predictions?.length) return null;

  const firstFixtureKickoffTiming = whenIsTheFixture(predictions[0].kickoff);

  let savingState: SAVING_STATE;
  if (isSaving) savingState = "SAVING";
  else if (showFeedback) savingState = isSaveError ? "FAILED" : "SUCCESS";
  else savingState = "IDLE";

  const isBbbLockedForGameweek = predictions.some(
    (predo) => predo.big_boy_bonus && isPastDeadline(predo.kickoff)
  );

  return (
    <form onSubmit={handleSubmit}>
      <Table>
        {predictions.map(
          (
            {
              fixtureId,
              kickoff,
              homeTeam,
              awayTeam,
              predictedHomeGoals,
              predictedAwayGoals,
              big_boy_bonus: bigBoyBonus,
              predictionScore,
            },
            i
          ) => (
            <GridRow
              key={fixtureId}
              fixtureId={fixtureId}
              kickoff={formatFixtureKickoffTime(
                kickoff,
                firstFixtureKickoffTiming
              )}
              homeTeam={homeTeam}
              awayTeam={awayTeam}
              homeGoals={predictedHomeGoals ?? ""}
              awayGoals={predictedAwayGoals ?? ""}
              updateGoals={updateGoals}
              isBigBoyBonus={bigBoyBonus}
              isBbbLocked={isBbbLockedForGameweek}
              predictionScore={predictionScore || undefined}
              locked={!isAlwaysEditable && isPastDeadline(kickoff)}
              topRow={i === 0}
              handleBbbUpdate={handleBbbUpdate}
            />
          )
        )}
      </Table>
      {isAlwaysEditable ||
      predictions.some((prediction) => !isPastDeadline(prediction.kickoff)) ? (
        <ButtonsAndMessageContainer>
          <ButtonContainer>
            <Button type="submit" variant="primary">
              Save
            </Button>
          </ButtonContainer>
          {savingState === "IDLE" && <div />}
          {savingState === "SAVING" && <UserFeedback>Saving...</UserFeedback>}
          {savingState === "SUCCESS" && (
            <UserFeedback>Predictions updated!</UserFeedback>
          )}
          {savingState === "FAILED" && (
            <UserFeedback>
              There was an error updating your predictions. Please try again.
            </UserFeedback>
          )}
        </ButtonsAndMessageContainer>
      ) : (
        <GameweekScore>
          {gameweekScore
            ? `Result: ${gameweekScore} points`
            : "Score not yet available"}
        </GameweekScore>
      )}
    </form>
  );
};

const Table = styled.div`
  display: grid;
  grid-template-columns: 11em 1fr auto 5px auto 1fr;
  grid-auto-rows: 4.8em;

  @media (max-width: ${pageSizes.tablet}) {
    grid-template-columns: 7em 1fr auto 5px auto 1fr;
    grid-auto-rows: 3em;
  }

  @media (max-width: ${pageSizes.mobileM}) {
    grid-template-columns: 6em 1fr auto 5px auto 1fr;
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
  margin-top: 1.6rem;

  @media (max-width: 650px) {
    flex-direction: column;
  }
`;

const ButtonContainer = styled.div`
  order: 3;
  flex-basis: 200px;

  @media (max-width: 650px) {
    order: 1;
    flex-basis: auto;
  }
`;

const UserFeedback = styled.p`
  order: 2;
  color: ${colours.cyan300};
  font-size: 1.8em;
  font-style: italic;
`;

const GameweekScore = styled.div`
  color: ${colours.grey300};
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