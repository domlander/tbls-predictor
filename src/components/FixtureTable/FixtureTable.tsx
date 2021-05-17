import React, { FormEvent } from "react";
import styled from "styled-components";

import colours from "@/styles/colours";
import { FixtureWithPrediction } from "@/types";
import { formatFixtureKickoffTime } from "@/utils";
import { calculateGameweekScore } from "utils/calculateGameweekScore";
import isPastDeadline from "utils/isPastDeadline";
import pageSizes from "../../styles/pageSizes";
import GridRow from "../molecules/GridRow";
import Button from "../atoms/Button";

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
          <ButtonContainer>
            <Button type="submit" variant="primary">
              Save
            </Button>
          </ButtonContainer>
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

const ButtonContainer = styled.div`
  max-width: 400px;
  margin: 16px 0 0 auto;
`;

const GameweekScore = styled.div`
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

const Table = styled.div`
  display: grid;
  grid-template-columns: 11em 1fr auto auto 1fr;
  grid-auto-rows: 4.8em;
  background: ${colours.grey200};
  outline: 0.1em solid ${colours.grey200};
  grid-gap: 0.1em;

  @media (max-width: ${pageSizes.tablet}) {
    grid-template-columns: 7em 1fr auto auto 1fr;
    grid-auto-rows: 3em;
  }

  @media (max-width: ${pageSizes.mobileM}) {
    grid-template-columns: 6em 1fr auto auto 1fr;
  }
`;

export default FixtureTable;
