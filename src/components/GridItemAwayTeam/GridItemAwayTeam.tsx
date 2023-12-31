"use client";

import { ReactNode } from "react";
import styles from "./GridItemAwayTeam.module.css";

export type Props = {
  className?: string;
  fixtureId: number;
  handleBbbUpdate?: (fixtureId: number) => void;
  isBbbLocked?: boolean;
  isBbbSelected?: boolean;
  label: string | ReactNode;
  isLoaded: boolean;
  locked: boolean;
  isTopRow: boolean;
};

const GridItemAwayTeam = ({
  fixtureId,
  handleBbbUpdate,
  isBbbLocked = false,
  isBbbSelected = false,
  label = "",
  isLoaded = false,
  locked,
  isTopRow,
}: Props) => {
  return (
    <div
      className={[
        styles.container,
        locked && styles.locked,
        isTopRow && styles.topRow,
      ].join(" ")}
    >
      {label}
      {isLoaded && !locked && !isBbbLocked && handleBbbUpdate && (
        <button
          className={[
            styles.bbbButton,
            isBbbSelected && styles.isSelected,
          ].join(" ")}
          onClick={(e) => {
            e.preventDefault();
            handleBbbUpdate(fixtureId);
          }}
        >
          2X
        </button>
      )}
    </div>
  );
};

export default GridItemAwayTeam;
