import React, { Dispatch, FormEvent, SetStateAction } from "react";
import styled from "styled-components";

import colours from "@/styles/colours";
import { EditablePrediction } from "@/types";
import { Fixture } from "@prisma/client";
import { formatFixtureKickoffTime, isGameweekComplete } from "@/utils";
import { calculateGameweekScore } from "utils/calculateGameweekScore";
import isPastDeadline from "utils/isPastDeadline";
import GridRow from "../molecules/GridRow";
import { correctChip, perfectChip } from "../atoms/Chip/Chip";
import Button from "../atoms/Button";

interface Props {
  fixtures: Fixture[];
  predictions: EditablePrediction[];
  setPredictions: Dispatch<SetStateAction<EditablePrediction[]>>;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isAlwaysEditable?: boolean;
}

const FixtureTable = ({
  fixtures,
  predictions,
  setPredictions,
  handleSubmit,
  isAlwaysEditable = false,
}: Props) => {
  const updateGoals = (
    fixtureId: number,
    isHomeTeam: boolean,
    goals: string
  ): void => {
    const index = predictions.findIndex((x) => x.fixtureId === fixtureId);
    const updatedPredictions = [
      ...predictions.slice(0, index),
      {
        fixtureId,
        homeGoals: isHomeTeam ? goals : predictions[index].homeGoals,
        awayGoals: isHomeTeam ? predictions[index].awayGoals : goals,
      },
      ...predictions.slice(index + 1),
    ];

    setPredictions(updatedPredictions);
  };
  const gameweekScore = calculateGameweekScore(predictions);

  return fixtures?.length ? (
    <Container>
      <form onSubmit={handleSubmit}>
        <Table>
          {fixtures.map((fixture) => {
            const prediction = predictions.find(
              (p) => p.fixtureId === fixture.id
            );

            let chip;
            if (prediction?.score === 3) chip = perfectChip;
            if (prediction?.score === 1) chip = correctChip;

            return (
              <GridRow
                key={fixture.id}
                fixtureId={fixture.id}
                kickoff={formatFixtureKickoffTime(fixture.kickoff)}
                homeTeam={fixture.homeTeam}
                awayTeam={fixture.awayTeam}
                homeGoals={prediction?.homeGoals || ""}
                awayGoals={prediction?.awayGoals || ""}
                updateGoals={updateGoals}
                chip={chip}
                locked={!isAlwaysEditable && isPastDeadline(fixture.kickoff)}
              />
            );
          })}
        </Table>
        {isAlwaysEditable || !isGameweekComplete(fixtures) ? (
          <SaveButton
            colour={colours.blackblue500}
            backgroundColour={colours.blue100}
            hoverColour={colours.blue200}
          >
            Save
          </SaveButton>
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
  ) : null;
};

const Container = styled.div`
  margin: 0 8px;
`;

const SaveButton = styled(Button)`
  margin-top: 16px;
`;

const Table = styled.div`
  display: grid;
  grid-template-columns: 7em 1fr auto auto 1fr;
  background: ${colours.grey100};
  border-radius: 0.1em;
`;

export default FixtureTable;
