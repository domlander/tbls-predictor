"use client";

import { FormEvent, useEffect, useState } from "react";

import Fixture from "src/types/Fixture";
import GridRow from "src/components/GridRowFixture";
import Heading from "src/components/Heading";
import Button from "src/components/Button";
import useTransientState from "src/hooks/useTransientState";
import styles from "./AdminUpdateResults.module.css";

interface Props {
  fixtures: Fixture[];
}

// TODO: There is a lot of similar logic with Predictions page. May want to extract out common logic
const AdminUpdateResults = ({ fixtures }: Props) => {
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

    const updatedScores: Partial<Fixture>[] = scores.filter(
      ({ id, homeGoals, awayGoals }) => {
        const savedScore = savedScores.find((x) => x.id === id);
        if (!savedScore) return false;

        return (
          savedScore.homeGoals !== homeGoals ||
          savedScore.awayGoals !== awayGoals
        );
      }
    );
    if (!updatedScores?.length) return;

    setIsSaving(true);
    setIsSaved(false);

    fetch("/api/updateFixtureResults", {
      method: "POST",
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

  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 6);

  const scoresToDisplay = isCurrentGameweekTab
    ? scores.filter((score) => new Date(score.kickoff) > lastWeek)
    : scores.filter((score) => new Date(score.kickoff) <= lastWeek);

  return (
    <div className={styles.container}>
      <Heading level="h1">Update Results</Heading>
      <Button
        variant="secondary"
        handleClick={() => setIsCurrentGameweekTab((x) => !x)}
      >
        {isCurrentGameweekTab ? "Old" : "Now"}
      </Button>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.table}>
          {scoresToDisplay.map((score, i) => (
            <GridRow
              key={score.id}
              fixtureId={score.id}
              kickoff={score.kickoff}
              firstFixtureInWeekKickoff={scores[0].kickoff}
              homeTeam={score.homeTeam}
              awayTeam={score.awayTeam}
              homeGoals={score.homeGoals?.toString() || ""}
              awayGoals={score.awayGoals?.toString() || ""}
              updateGoals={updateGoals}
              locked={false}
              isLoaded
              topRow={i === 0}
            />
          ))}
        </div>
        <Button type="submit" variant="primary">
          Save
        </Button>
        {showFeedback &&
          (isSaving ? (
            <p className={styles.feedback}>Saving...</p>
          ) : isSaved ? (
            <p className={styles.feedback}>Save successful!</p>
          ) : null)}
      </form>
    </div>
  );
};

export default AdminUpdateResults;
