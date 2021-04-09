import React, { Dispatch, FormEvent, SetStateAction } from "react";
import styled from "styled-components";

import colours from "@/styles/colours";
import FixtureTableRow from "@/components/FixtureTableRow";
import { EditablePrediction } from "@/types";
import { Fixture } from "@prisma/client";
import { isGameweekComplete, isPastDeadline } from "@/utils";

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

  return fixtures?.length ? (
    <Container>
      <form onSubmit={handleSubmit}>
        <Table>
          <tbody>
            {fixtures.map((fixture) => {
              const prediction = predictions.find(
                (p) => p.fixtureId === fixture.id
              );

              return (
                <FixtureTableRow
                  key={fixture.id}
                  fixtureId={fixture.id}
                  kickoff={fixture.kickoff}
                  homeTeam={fixture.homeTeam}
                  awayTeam={fixture.awayTeam}
                  homeGoals={prediction?.homeGoals || ""}
                  awayGoals={prediction?.awayGoals || ""}
                  updateGoals={updateGoals}
                  allowEditScore={
                    isAlwaysEditable || !isPastDeadline(fixture.kickoff)
                  }
                />
              );
            })}
          </tbody>
        </Table>
        {isAlwaysEditable || !isGameweekComplete(fixtures) ? (
          // TODO: Show the user what they actually scored
          <SaveButton type="submit" value="Save" />
        ) : (
          <p>Result: 10 points</p>
        )}
      </form>
    </Container>
  ) : null;
};

const Container = styled.div`
  margin: 0 auto;
  max-width: 500px;
`;

const SaveButton = styled.input`
  margin: 1rem 0.25rem;
  padding: 0.25rem 1.5rem;
  color: ${colours.black500};
  background-color: ${colours.grey100};
  border: 1px solid ${colours.grey500};
`;

const Table = styled.table`
  width: 100%;
  margin: 0 auto;
  background: ${colours.grey100};
  border-radius: 0.1em;
`;

export default FixtureTable;
