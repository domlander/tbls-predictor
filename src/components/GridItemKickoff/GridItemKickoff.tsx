"use client";

import {
  formatFixtureKickoffTime,
  whenIsTheFixture,
} from "utils/kickoffDateHelpers";
import styles from "./GridItemKickoff.module.css";

export type Props = {
  kickoff: Date;
  firstFixtureInWeekKickoff: Date;
  locked: boolean;
  topRow: boolean;
};

const GridItemKickoff = ({
  kickoff,
  firstFixtureInWeekKickoff,
  locked,
  topRow,
}: Props) => {
  const fixturesFormat = whenIsTheFixture(firstFixtureInWeekKickoff);
  const formattedKickoff = formatFixtureKickoffTime(kickoff, fixturesFormat);

  return (
    <span
      className={[
        styles.kickoff,
        locked && styles.locked,
        topRow && styles.topRow,
      ].join(" ")}
    >
      {formattedKickoff}
    </span>
  );
};

export default GridItemKickoff;
