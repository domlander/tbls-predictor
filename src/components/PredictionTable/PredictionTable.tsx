import React, { FC } from "react";
import styled from "styled-components";
import matches from '../../mockData/matches';
import { Fixture } from "@/types";
import colours from "@/styles/colours"
import PredictionTableRow from "@/components/PredictionTableRow";

interface Props {
  handleSubmitPredictions: (e: any) => void
  gameweekFinished?: boolean
}

const PredictionTable: FC<Props> = ({ handleSubmitPredictions, gameweekFinished = false }) => {
  const fixtures: Fixture[] = matches[0].fixtures

  if (!fixtures?.length) return <></>;

  return (
    <Container>
      <form onSubmit={handleSubmitPredictions}>
        <Table>
          <tbody>
            {fixtures.map(f => <PredictionTableRow key={f.id} fixture={f} />)}
          </tbody>
        </Table>
        {
          // TODO: Don't render a form if the gameweek is over
          !gameweekFinished ? <SaveButton type="submit" value="Save" /> : <p>Result: 10 points</p>
        }
      </form>
    </Container>
  )
}

const Container = styled.div`
  margin: 0 0.2rem;
`

const SaveButton = styled.input`
  margin: 1rem 0.25rem;
  padding: 0.25rem 1.5rem;
  color: ${colours.black500};
  background-color: ${colours.grey100};
  border: 1px solid ${colours.grey500};
`

const Table = styled.table`
  width: 100%;
  margin: 0 auto;
  background: ${colours.grey100};
  border-radius: 0.1em;
`

export default PredictionTable;