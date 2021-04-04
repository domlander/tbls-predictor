import React, { FormEvent } from "react";
import styled from "styled-components";

import colours from "@/styles/colours";
import PredictionTableRow from "@/components/PredictionTableRow";
import { FixtureWithPrediction } from "@/types";

interface Props {
  fixtures: FixtureWithPrediction[];
  handleSubmitPredictions: (e: FormEvent<HTMLFormElement>) => void;
  gameweekFinished: boolean;
}

const PredictionTable = ({
  fixtures,
  handleSubmitPredictions,
  gameweekFinished,
}: Props) => {
  console.log({ fixtures });

  return fixtures?.length ? (
    <Container>
      <form onSubmit={(e) => handleSubmitPredictions(e)}>
        <Table>
          <tbody>
            {fixtures.map((fixture) => (
              <PredictionTableRow key={fixture.fixtureId} fixture={fixture} />
            ))}
          </tbody>
        </Table>
        {
          // TODO: Don't render a form if the gameweek is over
          !gameweekFinished ? (
            <SaveButton type="submit" value="Save" />
          ) : (
            // TODO: Show the user what they actually scored
            <p>Result: 10 points</p>
          )
        }
      </form>
    </Container>
  ) : null;
};

const Container = styled.div`
  margin: 0 0.2rem;
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

export default PredictionTable;
