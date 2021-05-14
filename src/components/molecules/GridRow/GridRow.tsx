import React from "react";
import { Fixture } from "@prisma/client";

import GridItem from "../../atoms/GridItem";
import ScoreInput from "../../atoms/ScoreInput";

export type Props = {
  fixtureId: Fixture["id"];
  kickoff: string;
  homeTeam: Fixture["homeTeam"];
  awayTeam: Fixture["awayTeam"];
  homeGoals: string;
  awayGoals: string;
  updateGoals: (
    fixtureId: number,
    isHomeTeam: boolean,
    homeGoals: string
  ) => void;
  predictionScore?: number;
  locked: boolean;
};

const GridRow = ({
  fixtureId,
  kickoff,
  homeTeam,
  homeGoals,
  awayTeam,
  awayGoals,
  updateGoals,
  predictionScore,
  locked,
}: Props) => (
  <>
    <GridItem locked={locked} label={kickoff} alignText="center" />
    <GridItem
      locked={locked}
      label={homeTeam}
      alignText="right"
      predictionScore={predictionScore}
    />
    <ScoreInput
      isScoreEditable={!locked}
      fixtureId={fixtureId}
      goals={homeGoals}
      isHome
      updateGoals={updateGoals}
    />
    <ScoreInput
      isScoreEditable={!locked}
      fixtureId={fixtureId}
      goals={awayGoals}
      isHome={false}
      updateGoals={updateGoals}
    />
    <GridItem locked={locked} label={awayTeam} alignText="left" />
  </>
);

export default GridRow;
