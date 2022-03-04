import React, { FormEvent, useEffect, useState } from "react";
import styled from "styled-components";

import {
  formatFixtureKickoffTime,
  whenIsTheFixture,
} from "utils/kickoffDateHelpers";
import Fixture from "src/types/Fixture";
import pageSizes from "src/styles/pageSizes";
import colours from "src/styles/colours";
import GridRow from "src/components/GridRow";
import Heading from "src/components/Heading";
import Button from "src/components/Button";
import useTransientState from "src/hooks/useTransientState";

interface Props {
  fixtures: Fixture[];
}

// TODO: There is a lot of similar logic with Predictions page. May want to extract out common logic
const UpdateResultsPage = ({ fixtures }: Props) => {
  const [savedScores, setSavedScores] = useState(fixtures);
  const [scores, setScores] = useState(fixtures);
  const [isCurrentGameweekTab, setIsCurrentGameweekTab] = useState(true);
  const [showFeedback, setShowFeedback] = useTransientState(false, 3000);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (isSaving || isSaved) setShowFeedback(true);
  }, [isSaving, isSaved]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSaving(true);
    setIsSaved(false);

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
    })
      .then(() => {
        setSavedScores(scores);
        setIsSaved(true);
      })
      .catch(() => {
        setIsSaved(false);
      })
      .finally(() => {
        setIsSaving(false);
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
        {showFeedback &&
          (isSaving ? (
            <UserFeedback>Saving...</UserFeedback>
          ) : isSaved ? (
            <UserFeedback>Save successful!</UserFeedback>
          ) : null)}
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

const UserFeedback = styled.p`
  color: ${colours.cyan300};
  font-size: 1.8em;
  font-style: italic;
  margin-top: 1em;
`;

export default UpdateResultsPage;
