import React, { FormEvent } from "react";
import styled from "styled-components";

import colours from "@/styles/colours";
import { FixtureWithPrediction } from "@/types";
import { formatFixtureKickoffTime } from "@/utils";
import { calculateGameweekScore } from "utils/calculateGameweekScore";
import isPastDeadline from "utils/isPastDeadline";
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
          // TODO: Show the user what they actually scored
          <p>
            {gameweekScore
              ? `Result: ${gameweekScore} points`
              : "Calculating score..."}
          </p>
        )}
      </form>
    </>
  );
};

const ButtonContainer = styled.div`
  margin-top: 16px;
`;

const Table = styled.div`
  display: grid;
  grid-template-columns: 7em 1fr auto auto 1fr;
  background: ${colours.grey200};
  outline: 0.1em solid ${colours.grey200};
  grid-gap: 0.1em;
`;

export default FixtureTable;
