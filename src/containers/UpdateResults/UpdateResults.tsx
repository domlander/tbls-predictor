import React, { FormEvent, useState } from "react";

import { EditablePrediction } from "@/types";
import { Fixture, Prediction } from "@prisma/client";
import FixtureTable from "@/components/FixtureTable";

interface Props {
  fixtures: Fixture[];
  initialScores: EditablePrediction[];
}

const UpdateResultsPage = ({ fixtures, initialScores }: Props) => {
  const [scores, setScores] = useState(initialScores);

  const handleSubmitPredictions = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedScores: Partial<Prediction>[] = scores.map((score) => ({
      fixtureId: score.fixtureId,
      homeGoals: score.homeGoals ? parseInt(score.homeGoals) : null,
      awayGoals: score.awayGoals ? parseInt(score.awayGoals) : null,
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

  return (
    <FixtureTable
      fixtures={fixtures}
      predictions={scores}
      setPredictions={setScores}
      handleSubmit={handleSubmitPredictions}
      isAlwaysEditable
    />
  );
};

export default UpdateResultsPage;
