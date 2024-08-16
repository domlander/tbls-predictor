"use client";

import {
  formatFixtureKickoffTime,
  whenIsTheFixture,
} from "utils/kickoffDateHelpers";
import styles from "./LeagueWeekKickoff.module.css";

export type Props = {
  kickoff: Date;
  firstFixtureInWeek: Date;
};

const LeagueWeekKickoff = ({ kickoff, firstFixtureInWeek }: Props) => {
  const firstFixtureKickoffTiming = whenIsTheFixture(firstFixtureInWeek);

  return (
    <div className={styles.kickoff}>
      {formatFixtureKickoffTime(kickoff, firstFixtureKickoffTiming)}
    </div>
  );
};

export default LeagueWeekKickoff;
