import React from "react";
import { Fixture } from "@prisma/client";

import { ChipType } from "../../atoms/Chip";
import GridItem from "../../atoms/GridItem";
import ScoreInput from "../../atoms/ScoreInput";

interface StyleProps {}

export type Props = StyleProps & {
  fixtureId: Fixture["id"];
  kickoff: string;
  homeTeam: Fixture["homeTeam"];
  awayTeam: Fixture["awayTeam"];
  homeGoals: string;
  awayGoals: string;
  updateGoals(fixtureId: number, isHomeTeam: boolean, homeGoals: string): void;
  chip?: ChipType;
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
  chip,
  locked,
}: Props) => (
  <>
    <GridItem locked={locked} label={kickoff} alignText="center" />
    <GridItem locked={locked} label={homeTeam} alignText="right" chip={chip} />
    <ScoreInput
      isScoreEditable
      fixtureId={fixtureId}
      goals={homeGoals}
      isHome
      updateGoals={updateGoals}
    />
    <ScoreInput
      isScoreEditable
      fixtureId={fixtureId}
      goals={awayGoals}
      isHome={false}
      updateGoals={updateGoals}
    />
    <GridItem locked={locked} label={awayTeam} alignText="left" />
  </>
);

export default GridRow;
