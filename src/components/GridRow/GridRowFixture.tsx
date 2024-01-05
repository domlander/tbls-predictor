import { ReactNode } from "react";

import Fixture from "src/types/Fixture";
import GridItemHomeTeam from "../GridItemHomeTeam";
import GridItemAwayTeam from "../GridItemAwayTeam";
import GridItemKickoff from "../GridItemKickoff";
import ScoreInput from "../ScoreInput";
import styles from "./GridRowFixture.module.css";

export type Props = {
  fixtureId: Fixture["id"];
  kickoff: string;
  homeTeam: Fixture["homeTeam"];
  awayTeam: Fixture["awayTeam"] | ReactNode;
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
  isLoaded,
  locked,
  topRow,
  handleBbbUpdate,
}: Props) => {
  return (
    <>
      <GridItemKickoff locked={locked} label={kickoff} topRow={topRow} />
      <GridItemHomeTeam
        isBbb={isBbbLocked && isBigBoyBonus}
        label={homeTeam}
        locked={locked}
        predictionScore={predictionScore}
        topRow={topRow}
      />
      <ScoreInput
        fixtureId={fixtureId}
        goals={homeGoals}
        isHome
        isEditable={!locked}
        isTopRow={topRow}
        updateGoals={updateGoals}
      />
      <span
        className={[
          styles.divider,
          topRow && styles.topRow,
          locked && styles.locked,
        ].join(" ")}
      >
        -
      </span>
      <ScoreInput
        fixtureId={fixtureId}
        goals={awayGoals}
        isHome={false}
        isEditable={!locked}
        isTopRow={topRow}
        updateGoals={updateGoals}
      />
      <GridItemAwayTeam
        fixtureId={fixtureId}
        handleBbbUpdate={handleBbbUpdate}
        isBbbLocked={isBbbLocked}
        isBbbSelected={isBigBoyBonus}
        label={awayTeam}
        isLoaded={isLoaded}
        locked={locked}
        isTopRow={topRow}
      />
    </>
  );
};

export default GridRow;
