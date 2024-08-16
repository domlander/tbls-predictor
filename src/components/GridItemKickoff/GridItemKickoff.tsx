"use client";

import {
  formatFixtureKickoffTime,
  whenIsTheFixture,
} from "utils/kickoffDateHelpers";
import styles from "./GridItemKickoff.module.css";
import { useEffect, useState } from "react";

export type Props = {
  kickoff: Date;
  firstFixtureInWeekKickoff: Date;
  locked: boolean;
  topRow: boolean;
};

const GridItemKickoff = ({
  kickoff: kickoffServerTime,
  firstFixtureInWeekKickoff,
  locked,
  topRow,
}: Props) => {
  const fixturesFormat = whenIsTheFixture(firstFixtureInWeekKickoff);
  const [kickoffTime, setKickoffTime] = useState<string | null>(null);

  useEffect(() => {
    setKickoffTime(formatFixtureKickoffTime(kickoffServerTime, fixturesFormat));
  }, [kickoffServerTime]);

  return (
    <span
      className={[
        styles.kickoff,
        locked && styles.locked,
        topRow && styles.topRow,
      ].join(" ")}
    >
      {kickoffTime}
    </span>
  );
};

export default GridItemKickoff;
