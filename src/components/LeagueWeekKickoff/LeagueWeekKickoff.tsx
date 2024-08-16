"use client";

import {
  formatFixtureKickoffTime,
  whenIsTheFixture,
} from "utils/kickoffDateHelpers";
import styles from "./LeagueWeekKickoff.module.css";
import { useEffect, useState } from "react";

export type Props = {
  kickoff: Date;
  firstFixtureInWeek: Date;
};

const LeagueWeekKickoff = ({
  kickoff: kickoffServerTime,
  firstFixtureInWeek,
}: Props) => {
  const fixturesFormat = whenIsTheFixture(firstFixtureInWeek);
  const [kickoffTime, setKickoffTime] = useState<string | null>(null);

  useEffect(() => {
    setKickoffTime(formatFixtureKickoffTime(kickoffServerTime, fixturesFormat));
  }, [kickoffServerTime]);

  return <div className={styles.kickoff}>{kickoffTime}</div>;
};

export default LeagueWeekKickoff;
