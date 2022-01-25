import React, { FormEvent, useState } from "react";
import styled from "styled-components";

import {
  formatFixtureKickoffTime,
  whenIsTheFixture,
} from "utils/kickoffDateHelpers";
import Fixture from "src/types/Fixture";
import Heading from "@/components/atoms/Heading";
import Button from "@/components/Button";
import GridRow from "@/components/molecules/GridRow";
import pageSizes from "../../styles/pageSizes";

interface Props {
  fixtures: Fixture[];
}

// TODO: There is a lot of similar logic with Predictions page. May want to extract out common logic
const UpdateResultsPage = ({ fixtures }: Props) => {
  const [savedScores, setSavedScores] = useState(fixtures);
  const [scores, setScores] = useState(fixtures);
  const [isCurrentGameweekTab, setIsCurrentGameweekTab] = useState(true);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedScores: Partial<Fixture>[] = scores
      .filter(({ id, homeGoals, awayGoals }) => {
        const savedScore = savedScores.find((x) => x.id === id);
        if (
          !savedScore ||
          (savedScore.homeGoals === homeGoals &&
            savedScore.awayGoals === awayGoals)
        )
          return false;

        return true;
      })
      .map(({ id, homeGoals, awayGoals }) => ({
        fixtureId: id,
        homeGoals,
        awayGoals,
      }));

    if (!updatedScores?.length) return;

    fetch("/api/updateFixtureResults", {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ scores: updatedScores }),
    }).then(() => setSavedScores(scores));
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

  if (!scores?.length) return <Heading level="h1">No fixtures</Heading>;

  const firstFixtureKickoffTiming = whenIsTheFixture(scores[0].kickoff);

  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 6);

  const scoresToDisplay = isCurrentGameweekTab
    ? scores.filter((score) => new Date(score.kickoff) > lastWeek)
    : scores.filter((score) => new Date(score.kickoff) <= lastWeek);

  return (
    <>
      <Heading level="h1">Update Results</Heading>
      <Tab
        variant="secondary"
        handleClick={() => setIsCurrentGameweekTab((x) => !x)}
      >
        {isCurrentGameweekTab ? "Old" : "Now"}
      </Tab>
      <form onSubmit={handleSubmit}>
        <Table>
          {scoresToDisplay.map((score, i) => (
            <GridRow
              key={score.id}
              fixtureId={score.id}
              kickoff={formatFixtureKickoffTime(
                score.kickoff,
                firstFixtureKickoffTiming
              )}
              homeTeam={score.homeTeam}
              awayTeam={score.awayTeam}
              homeGoals={score.homeGoals?.toString() || ""}
              awayGoals={score.awayGoals?.toString() || ""}
              updateGoals={updateGoals}
              locked={false}
              topRow={i === 0}
            />
          ))}
        </Table>
        <ButtonContainer>
          <Button type="submit" variant="primary">
            Save
          </Button>
        </ButtonContainer>
      </form>
    </>
  );
};

const ButtonContainer = styled.div`
  margin-top: 1.6em;
`;

const Tab = styled(Button)`
  margin-bottom: 1em;
`;

const Table = styled.div`
  display: grid;
  grid-template-columns: 11em 1fr auto 5px auto 1fr;
  grid-auto-rows: 4em;

  @media (max-width: ${pageSizes.tablet}) {
    grid-template-columns: 7em 1fr auto 5px auto 1fr;
    grid-auto-rows: 3em;
  }

  @media (max-width: ${pageSizes.mobileM}) {
    grid-template-columns: 6em 1fr auto 5px auto 1fr;
  }
`;

export default UpdateResultsPage;
