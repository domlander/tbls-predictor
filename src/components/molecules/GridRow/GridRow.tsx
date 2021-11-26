import React from "react";
import styled from "styled-components";
import { Fixture } from "@prisma/client";

import GridItemHomeTeam from "../../atoms/GridItemHomeTeam";
import GridItemAwayTeam from "../../atoms/GridItemAwayTeam";
import GridItemKickoff from "../../atoms/GridItemKickoff";
import ScoreInput from "../../atoms/ScoreInput";
import colours from "../../../styles/colours";

export type Props = {
  fixtureId: Fixture["id"];
  kickoff: string;
  homeTeam: Fixture["homeTeam"];
  awayTeam: Fixture["awayTeam"];
  homeGoals: string;
  awayGoals: string;
  isBigBoyBonus?: boolean;
  isBbbLocked?: boolean;
  updateGoals: (
    fixtureId: number,
    isHomeTeam: boolean,
    homeGoals: string
  ) => void;
  predictionScore?: number;
  locked: boolean;
  topRow: boolean;
  handleBbbUpdate?: (fixtureId: number) => void;
};

const GridRow = ({
  fixtureId,
  kickoff,
  homeTeam,
  homeGoals,
  awayTeam,
  awayGoals,
  isBigBoyBonus,
  isBbbLocked,
  updateGoals,
  predictionScore,
  locked,
  topRow,
  handleBbbUpdate,
}: Props) => {
  return (
    <>
      <Kickoff locked={locked} label={kickoff} topRow={topRow} />
      <HomeTeam
        isBbb={isBbbLocked && isBigBoyBonus}
        label={homeTeam}
        locked={locked}
        predictionScore={predictionScore}
        topRow={topRow}
      />
      <Score
        fixtureId={fixtureId}
        goals={homeGoals}
        isHome
        isScoreEditable={!locked}
        topRow={topRow}
        updateGoals={updateGoals}
      />
      <Divider locked={locked} topRow={topRow}>
        -
      </Divider>
      <Score
        fixtureId={fixtureId}
        goals={awayGoals}
        isHome={false}
        isScoreEditable={!locked}
        topRow={topRow}
        updateGoals={updateGoals}
      />
      <AwayTeam
        fixtureId={fixtureId}
        handleBbbUpdate={handleBbbUpdate}
        isBbbLocked={isBbbLocked}
        isBbbSelected={isBigBoyBonus}
        label={awayTeam}
        locked={locked}
        topRow={topRow}
      />
    </>
  );
};

const Kickoff = styled(GridItemKickoff)<{ locked: boolean; topRow: boolean }>`
  color: ${({ locked }) => (locked ? colours.grey500 : colours.grey100)};
  border-top: ${({ topRow }) =>
    !topRow ? `1px solid ${colours.whiteOpacity25}` : "none"};
`;

const HomeTeam = styled(GridItemHomeTeam)<{ locked: boolean; topRow: boolean }>`
  color: ${({ locked }) => (locked ? colours.grey500 : colours.grey100)};
  border-top: ${({ topRow }) =>
    !topRow ? `1px solid ${colours.whiteOpacity25}` : "none"};
`;

const AwayTeam = styled(GridItemAwayTeam)<{ locked: boolean; topRow: boolean }>`
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
