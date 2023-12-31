"use client";

import { ReactNode } from "react";
import styled from "styled-components";
import colours from "src/styles/colours";
import pageSizes from "src/styles/pageSizes";
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
        <BbbButton
          $isBbbSelected={isBbbSelected}
          onClick={(e) => {
            e.preventDefault();
            handleBbbUpdate(fixtureId);
          }}
        >
          2X
        </BbbButton>
      )}
    </div>
  );
};

const BbbButton = styled.button<{
  $isBbbSelected: Props["isBbbSelected"];
}>`
  color: ${({ $isBbbSelected }) =>
    $isBbbSelected ? colours.blackblue500 : colours.cyan300};
  background-color: ${({ $isBbbSelected }) =>
    $isBbbSelected ? colours.cyan300 : colours.blackblue500};
  border: ${({ $isBbbSelected }) =>
    `1px solid ${$isBbbSelected ? colours.cyan300 : colours.cyan500}`};
  border-radius: 0.2em;
  cursor: pointer;
  line-height: 1.3em;

  padding: 0px 0.4em;
  @media (max-width: ${pageSizes.mobileL}) {
    padding: 0 0.3em;
  }

  &:hover,
  &:focus {
    background-color: ${colours.cyan300};
    color: ${colours.blackblue500};
    border: 1px solid ${colours.cyan300};
  }
`;

export default GridItemAwayTeam;
