import React, { FormEvent } from "react";
import styled from "styled-components";

import { FixtureWithPrediction } from "@/types";
import { calculateGameweekScore } from "utils/calculateGameweekScore";
import isPastDeadline from "utils/isPastDeadline";
import useTransientState from "src/hooks/useTransientState";
import { formatFixtureKickoffTime } from "utils/formatFixtureKickoffTime";
import Button from "../atoms/Button";
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
}

const FixtureTable = ({
  predictions,
  updateGoals,
  handleSubmit,
  isAlwaysEditable = false,
}: Props) => {
  const [showUpdated, setShowUpdated] = useTransientState(false, 1000);
  const gameweekScore = calculateGameweekScore(predictions);

  if (!predictions?.length) return null;

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Table>
          {predictions.map((prediction) => (
            <GridRow
              key={prediction.fixtureId}
              fixtureId={prediction.fixtureId}
              kickoff={formatFixtureKickoffTime(prediction.kickoff)}
              homeTeam={prediction.homeTeam}
              awayTeam={prediction.awayTeam}
              homeGoals={prediction?.predictedHomeGoals ?? ""}
              awayGoals={prediction?.predictedAwayGoals ?? ""}
              updateGoals={updateGoals}
              predictionScore={prediction?.predictionScore || undefined}
              locked={!isAlwaysEditable && isPastDeadline(prediction.kickoff)}
            />
          ))}
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
              <UserFeedback>Predictions updated</UserFeedback>
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
  grid-template-columns: 11em 1fr auto auto 1fr;
  grid-auto-rows: 4.8em;
  grid-gap: 0.1em;

  @media (max-width: ${pageSizes.tablet}) {
    grid-template-columns: 7em 1fr auto auto 1fr;
    grid-auto-rows: 3em;
  }

  @media (max-width: ${pageSizes.mobileM}) {
    grid-template-columns: 6em 1fr auto auto 1fr;
  }
`;

const ButtonsAndMessageContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 16px;

  @media (max-width: 650px) {
    flex-direction: column;
  }
`;

const ButtonContainer = styled.div`
  order: 3;
  flex-basis: 400px;

  @media (max-width: 650px) {
    order: 1;
    flex-basis: auto;
  }
`;

const UserFeedback = styled.p`
  order: 2;
  font-size: 2em;
  font-style: italic;
  margin: 16px 0 0;
`;

const GameweekScore = styled.div`
  color: ${colours.grey300};
  margin-top: 14px;
  margin-left: 10px;
  font-size: 2em;

  @media (max-width: ${pageSizes.tablet}) {
    margin-top: 10px;
    margin-left: 7px;
    font-size: 1.4em;
  }

  @media (max-width: ${pageSizes.mobileM}) {
    margin-top: 8px;
    margin-left: 5px;
    font-size: 1.2em;
  }
`;

export default FixtureTable;
