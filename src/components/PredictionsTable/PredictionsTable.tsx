import React, { FormEvent } from "react";
import styled from "styled-components";

import { FixtureWithPrediction } from "@/types";
import { calculateGameweekScore } from "utils/calculateGameweekScore";
import isPastDeadline from "utils/isPastDeadline";
import useTransientState from "src/hooks/useTransientState";
import {
  formatFixtureKickoffTime,
  whenIsTheFixture,
} from "utils/kickoffDateHelpers";
import Button from "../Button";
import GridRow from "../molecules/GridRow";
import colours from "../../styles/colours";
import pageSizes from "../../styles/pageSizes";

interface Props {
  predictions: FixtureWithPrediction[];
  updateGoals: (
    fixtureId: number,
    isHomeTeam: boolean,
    homeGoals: string
  ) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isAlwaysEditable?: boolean;
  isErrorOnUpdate?: boolean;
}

const PredictionsTable = ({
  predictions,
  updateGoals,
  handleSubmit,
  isAlwaysEditable = false,
  isErrorOnUpdate = false,
}: Props) => {
  const [showUpdated, setShowUpdated] = useTransientState(false, 1500);
  const gameweekScore = calculateGameweekScore(predictions);

  if (!predictions?.length) return null;

  const firstFixtureKickoffTiming = whenIsTheFixture(predictions[0].kickoff);

  return (
    <>
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
                predictionScore={predictionScore || undefined}
                locked={!isAlwaysEditable && isPastDeadline(kickoff)}
                topRow={i === 0}
              />
            )
          )}
        </Table>
        {isAlwaysEditable ||
        predictions.some(
          (prediction) => !isPastDeadline(prediction.kickoff)
        ) ? (
          <ButtonsAndMessageContainer>
            <ButtonContainer>
              <Button
                type="submit"
                variant="primary"
                handleClick={() => setShowUpdated(true)}
              >
                Save
              </Button>
            </ButtonContainer>
            {showUpdated ? (
              <UserFeedback>
                {isErrorOnUpdate
                  ? "There was an error updating your predictions. Please try again."
                  : "Predictions updated!"}
              </UserFeedback>
            ) : (
              <div />
            )}
          </ButtonsAndMessageContainer>
        ) : (
          <GameweekScore>
            {gameweekScore
              ? `Result: ${gameweekScore} points`
              : "Calculating score..."}
          </GameweekScore>
        )}
      </form>
    </>
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
  color: ${colours.cyan500};
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
