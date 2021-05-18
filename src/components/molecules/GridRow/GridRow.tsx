import React from "react";
import styled from "styled-components";
import { Fixture } from "@prisma/client";

import GridItem from "../../atoms/GridItem";
import ScoreInput from "../../atoms/ScoreInput";
import pageSizes from "../../../styles/pageSizes";
import colours from "../../../styles/colours";

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
    <KickoffGridItem locked={locked} label={kickoff} alignText="center" />
    <Team
      locked={locked}
      label={homeTeam}
      alignText="right"
      predictionScore={predictionScore}
    />
    <Score
      isScoreEditable={!locked}
      fixtureId={fixtureId}
      goals={homeGoals}
      isHome
      updateGoals={updateGoals}
    />
    <Score
      isScoreEditable={!locked}
      fixtureId={fixtureId}
      goals={awayGoals}
      isHome={false}
      updateGoals={updateGoals}
    />
    <Team locked={locked} label={awayTeam} alignText="left" />
  </>
);

const KickoffGridItem = styled(GridItem)<{ locked: boolean }>`
  color: ${({ locked }) => (locked ? colours.grey500 : colours.grey100)};
  font-size: 1.6em;

  @media (max-width: ${pageSizes.tablet}) {
    font-size: 1em;
  }

  @media (max-width: ${pageSizes.mobileM}) {
    font-size: 0.9em;
  }
`;

const Team = styled(GridItem)<{ locked: boolean }>`
  color: ${({ locked }) => (locked ? colours.grey500 : colours.grey100)};
`;

const Score = styled(ScoreInput)<{ isScoreEditable: boolean }>`
  color: ${({ isScoreEditable }) =>
    !isScoreEditable ? colours.grey500 : colours.grey100};
`;

export default GridRow;
