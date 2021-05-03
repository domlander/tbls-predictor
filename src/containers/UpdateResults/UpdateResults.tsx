import React, { FormEvent, useState } from "react";

import { Fixture } from "@prisma/client";
import Heading from "@/components/atoms/Heading";
import styled from "styled-components";
import Button from "@/components/atoms/Button";
import colours from "@/styles/colours";
import GridRow from "@/components/molecules/GridRow";
import { formatFixtureKickoffTime } from "@/utils";

interface Props {
  fixtures: Fixture[];
}

// TODO: There is a lot of similar logic with Predictions page. May want to extract out common logic
const UpdateResultsPage = ({ fixtures }: Props) => {
  const [scores, setScores] = useState(fixtures);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedScores: Partial<Fixture>[] = scores.map((score) => ({
      fixtureId: score.id,
      homeGoals: score.homeGoals,
      awayGoals: score.awayGoals,
    }));

    fetch("/api/updateFixtureResults", {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ scores: updatedScores }),
    });
  };

  const updateGoals = (
    fixtureId: number,
    isHomeTeam: boolean,
    goals: string
  ): void => {
    if (goals !== "" && goals !== "0" && !parseInt(goals)) return;

    // Make a copy of current state
    const updatedScore: Fixture[] = JSON.parse(JSON.stringify(scores));

    // Find the score we've changed
    const editedScore = updatedScore.find(
      (fixture: Fixture) => fixture.id === fixtureId
    );
    if (!editedScore) return;

    if (isHomeTeam) {
      editedScore.homeGoals = parseInt(goals);
    } else {
      editedScore.awayGoals = parseInt(goals);
    }

    setScores(updatedScore);
  };

  return (
    <>
      <Heading level="h1">Update Results</Heading>
      <Container>
        <form onSubmit={handleSubmit}>
          <Table>
            {scores.map((score) => (
              <GridRow
                key={score.id}
                fixtureId={score.id}
                kickoff={formatFixtureKickoffTime(score.kickoff)}
                homeTeam={score.homeTeam}
                awayTeam={score.awayTeam}
                homeGoals={score.homeGoals?.toString() || ""}
                awayGoals={score.awayGoals?.toString() || ""}
                updateGoals={updateGoals}
                locked={false}
              />
            ))}
          </Table>
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
        </form>
      </Container>
    </>
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

export default UpdateResultsPage;
