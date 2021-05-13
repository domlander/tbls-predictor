import React, { FormEvent } from "react";
import styled from "styled-components";

import colours from "@/styles/colours";
import { FixtureWithPrediction } from "@/types";
import { formatFixtureKickoffTime } from "@/utils";
import { calculateGameweekScore } from "utils/calculateGameweekScore";
import isPastDeadline from "utils/isPastDeadline";
import GridRow from "../molecules/GridRow";
import { correctChip, perfectChip } from "../atoms/Chip/Chip";
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
    <Container>
      <form onSubmit={handleSubmit}>
        <Table>
          {predictions.map((prediction) => {
            let chip;
            if (prediction?.predictionScore === 3) chip = perfectChip;
            if (prediction?.predictionScore === 1) chip = correctChip;

            return (
              <GridRow
                key={prediction.fixtureId}
                fixtureId={prediction.fixtureId}
                kickoff={formatFixtureKickoffTime(prediction.kickoff)}
                homeTeam={prediction.homeTeam}
                awayTeam={prediction.awayTeam}
                homeGoals={prediction?.predictedHomeGoals ?? ""}
                awayGoals={prediction?.predictedAwayGoals ?? ""}
                updateGoals={updateGoals}
                chip={chip}
                locked={!isAlwaysEditable && isPastDeadline(prediction.kickoff)}
              />
            );
          })}
        </Table>
        {isAlwaysEditable ||
        predictions.some(
          (prediction) => !isPastDeadline(prediction.kickoff)
        ) ? (
          <ButtonContainer>
            <Button
              type="submit"
              colour={colours.blackblue500}
              backgroundColour={colours.blue100}
              hoverColour={colours.cyan500}
            >
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
    </Container>
  );
};

const Container = styled.div`
  margin: 0 8px;
`;

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
