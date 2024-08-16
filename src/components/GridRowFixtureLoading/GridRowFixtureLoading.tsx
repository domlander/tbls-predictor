import { ReactNode } from "react";
import GridItemHomeTeam from "../GridItemHomeTeam";
import GridItemAwayTeam from "../GridItemAwayTeam";
import GridItemKickoff from "../GridItemKickoff";
import Fixture from "src/types/Fixture";
import styles from "./GridRowFixtureLoading.module.css";

export type Props = {
  fixtureId: Fixture["id"];
  kickoff: Date;
  firstFixtureInWeekKickoff: Date;
  homeTeam: Fixture["homeTeam"];
  awayTeam: Fixture["awayTeam"] | ReactNode;
  topRow: boolean;
};

const GridRowFixtureLoading = ({
  fixtureId,
  kickoff,
  firstFixtureInWeekKickoff,
  homeTeam,
  awayTeam,
  topRow,
}: Props) => {
  return (
    <>
      <GridItemKickoff
        kickoff={kickoff}
        firstFixtureInWeekKickoff={firstFixtureInWeekKickoff}
        locked={true}
        topRow={topRow}
      />
      <GridItemHomeTeam
        isBbb={false}
        label={homeTeam}
        locked={true}
        topRow={topRow}
      />
      <span
        className={[styles.middle, topRow && styles.topRow].join(" ")}
      ></span>
      <GridItemAwayTeam
        fixtureId={fixtureId}
        isBbbLocked={false}
        isBbbSelected={false}
        label={awayTeam}
        isLoaded={false}
        locked={true}
        isTopRow={topRow}
      />
    </>
  );
};

export default GridRowFixtureLoading;
