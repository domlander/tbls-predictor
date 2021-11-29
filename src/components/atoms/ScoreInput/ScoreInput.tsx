import React from "react";
import { Fixture } from "@prisma/client";
import styled from "styled-components";

import colours from "../../../styles/colours";

interface StyleProps {
  isScoreEditable: boolean;
}

export type Props = StyleProps & {
  fixtureId: Fixture["id"];
  goals: string;
  className?: string;
  isHome: boolean;
  updateGoals: (
    fixtureId: number,
    isHomeTeam: boolean,
    homeGoals: string
  ) => void;
};

const ScoreInput = ({
  fixtureId,
  goals,
  isHome,
  isScoreEditable,
  updateGoals,
  className,
}: Props) => (
  <Input
    autoComplete="off"
    placeholder={isScoreEditable ? "?" : ""}
    disabled={!isScoreEditable}
    isScoreEditable={isScoreEditable}
    maxLength={1}
    name={`${isHome ? "home" : "away"}-score-${fixtureId}`}
    onChange={(e) => updateGoals(fixtureId, isHome, e.target.value)}
    type="number"
    value={goals}
    className={className}
    pattern="[0-9]"
    inputMode="numeric"
  />
);

const Input = styled.input<StyleProps>`
  border: 0;
  width: 2em;
  background-color: inherit;
  text-align: center;
  :focus {
    outline: none;
  }
  ::placeholder {
    color: ${colours.grey500opacity50};
  }

  // Hide arrows
  /* Chrome, Safari, Edge, Opera */
  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  -moz-appearance: textfield;
`;

export default ScoreInput;
