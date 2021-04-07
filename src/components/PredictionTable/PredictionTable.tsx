import React, { FormEvent, useState } from "react";
import styled from "styled-components";

import colours from "@/styles/colours";
import PredictionTableRow from "@/components/PredictionTableRow";
import { EditablePrediction } from "@/types";
import { Fixture, Prediction } from "@prisma/client";

interface Props {
  gameweek: number;
  fixtures: Fixture[];
  predictions: EditablePrediction[];
  gameweekFinished: boolean;
}

const PredictionTable = ({
  gameweek,
  fixtures,
  predictions: initialPredictions,
  gameweekFinished,
}: Props) => {
  const [predictions, setPredictions] = useState(initialPredictions);

  const handleSubmitPredictions = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedPredictions: Partial<Prediction>[] = predictions.map(
      (prediction) => ({
        fixtureId: prediction.fixtureId,
        homeGoals: parseInt(prediction.homeGoals || "") ?? null,
        awayGoals: parseInt(prediction.awayGoals || "") ?? null,
      })
    );

    fetch("/api/upsertPredictions", {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gameweek, updatedPredictions }),
    });
  };

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
      <form onSubmit={handleSubmitPredictions}>
        <Table>
          <tbody>
            {fixtures.map((fixture) => {
              const prediction = predictions.find(
                (p) => p.fixtureId === fixture.id
              );

              return (
                <PredictionTableRow
                  key={fixture.id}
                  fixtureId={fixture.id}
                  kickoff={fixture.kickoff}
                  homeTeam={fixture.homeTeam}
                  awayTeam={fixture.awayTeam}
                  homeGoals={prediction?.homeGoals || ""}
                  awayGoals={prediction?.awayGoals || ""}
                  updateGoals={updateGoals}
                />
              );
            })}
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

export default PredictionTable;
