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
  isBigBoyBonus: boolean;
  updateGoals: (
    fixtureId: number,
    isHomeTeam: boolean,
    homeGoals: string
  ) => void;
  predictionScore?: number;
  locked: boolean;
  topRow: boolean;
};

const GridRow = ({
  fixtureId,
  kickoff,
  homeTeam,
  homeGoals,
  awayTeam,
  awayGoals,
  isBigBoyBonus,
  updateGoals,
  predictionScore,
  locked,
  topRow,
}: Props) => (
  <>
    <KickoffGridItem
      locked={locked}
      label={kickoff}
      alignText="center"
      topRow={topRow}
    />
    <Team
      locked={locked}
      label={homeTeam}
      alignText="right"
      predictionScore={predictionScore}
      isBigBoyBonus={isBigBoyBonus}
      topRow={topRow}
    />
    <Score
      isScoreEditable={!locked}
      fixtureId={fixtureId}
      goals={homeGoals}
      isHome
      updateGoals={updateGoals}
      topRow={topRow}
    />
    <Divider locked={locked} topRow={topRow}>
      -
    </Divider>
    <Score
      isScoreEditable={!locked}
      fixtureId={fixtureId}
      goals={awayGoals}
      isHome={false}
      updateGoals={updateGoals}
      topRow={topRow}
    />
    <Team locked={locked} label={awayTeam} alignText="left" topRow={topRow} />
  </>
);

const KickoffGridItem = styled(GridItem)<{ locked: boolean; topRow: boolean }>`
  color: ${({ locked }) => (locked ? colours.grey500 : colours.grey100)};
  border-top: ${({ topRow }) =>
    !topRow ? `1px solid ${colours.whiteOpacity25}` : "none"};
  font-size: 1.6em;

  @media (max-width: ${pageSizes.tablet}) {
    font-size: 1em;
  }

  @media (max-width: ${pageSizes.mobileM}) {
    font-size: 0.9em;
  }
`;

const Team = styled(GridItem)<{ locked: boolean; topRow: boolean }>`
  color: ${({ locked }) => (locked ? colours.grey500 : colours.grey100)};
  border-top: ${({ topRow }) =>
    !topRow ? `1px solid ${colours.whiteOpacity25}` : "none"};
`;

const Score = styled(ScoreInput)<{ isScoreEditable: boolean; topRow: boolean }>`
  color: ${({ isScoreEditable }) =>
    !isScoreEditable ? colours.grey500 : colours.grey100};
  border-top: ${({ topRow }) =>
    !topRow ? `1px solid ${colours.whiteOpacity25}` : "none"};
`;

const Divider = styled.span<{ locked: boolean; topRow: boolean }>`
  border-top: ${({ topRow }) =>
    !topRow ? `1px solid ${colours.whiteOpacity25}` : "none"};
  color: ${({ locked }) => (locked ? colours.grey500 : colours.grey100)};
  align-self: stretch;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export default GridRow;
