import React from "react";
import styled from "styled-components";
import Fixture from "src/types/Fixture";
import colours from "src/styles/colours";
import GridItemHomeTeam from "../GridItemHomeTeam";
import GridItemAwayTeam from "../GridItemAwayTeam";
import GridItemKickoff from "../GridItemKickoff";
import ScoreInput from "../ScoreInput";

export type Props = {
  fixtureId: Fixture["id"];
  kickoff: string;
  homeTeam: Fixture["homeTeam"];
  awayTeam: Fixture["awayTeam"] | React.ReactNode;
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
  isLoading: boolean;
  isLoaded: boolean;
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
  isLoading,
  isLoaded,
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
      {!isLoaded || isLoading ? (
        <EmptySpace topRow={topRow} />
      ) : (
        <>
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
        </>
      )}

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

const EmptySpace = styled.div<{ topRow: boolean }>`
  grid-column: span 3;
  width: calc(4em + 13px);
  border-top: ${({ topRow }) =>
    !topRow ? `1px solid ${colours.whiteOpacity20}` : "none"};
`;

const Kickoff = styled(GridItemKickoff)<{ locked: boolean; topRow: boolean }>`
  color: ${({ locked }) => (locked ? colours.grey500 : colours.grey200)};
  border-top: ${({ topRow }) =>
    !topRow ? `1px solid ${colours.whiteOpacity20}` : "none"};
`;

const HomeTeam = styled(GridItemHomeTeam)<{ locked: boolean; topRow: boolean }>`
  /* font-size: 1.4rem; */
  color: ${({ locked }) => (locked ? colours.grey500 : colours.grey200)};
  border-top: ${({ topRow }) =>
    !topRow ? `1px solid ${colours.whiteOpacity20}` : "none"};
`;

const AwayTeam = styled(GridItemAwayTeam)<{ locked: boolean; topRow: boolean }>`
  /* font-size: 1.4rem; */
  color: ${({ locked }) => (locked ? colours.grey500 : colours.grey200)};
  border-top: ${({ topRow }) =>
    !topRow ? `1px solid ${colours.whiteOpacity20}` : "none"};
`;

const Score = styled(ScoreInput)<{ isScoreEditable: boolean; topRow: boolean }>`
  color: ${({ isScoreEditable }) =>
    !isScoreEditable ? colours.grey500 : colours.grey200};
  border: 0;
  border-top: ${({ topRow }) =>
    !topRow ? `1px solid ${colours.whiteOpacity20}` : "none"};
`;

const Divider = styled.span<{ locked: boolean; topRow: boolean }>`
  border-top: ${({ topRow }) =>
    !topRow ? `1px solid ${colours.whiteOpacity20}` : "none"};
  color: ${({ locked }) => (locked ? colours.grey500 : colours.grey200)};
  align-self: stretch;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export default GridRow;
