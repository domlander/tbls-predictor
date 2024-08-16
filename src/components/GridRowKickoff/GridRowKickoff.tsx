"use client";

import { getShortDateKickoffTime } from "utils/kickoffDateHelpers";
import styles from "./GridRowKickoff.module.css";

export type Props = {
  kickoff: Date;
  isHome: boolean;
};

const GridRowKickoff = ({ kickoff, isHome }: Props) => {
  return (
    <div
      className={[styles.kickoff, isHome ? styles.home : styles.away].join(" ")}
    >
      {getShortDateKickoffTime(kickoff)}
    </div>
  );
};

export default GridRowKickoff;
