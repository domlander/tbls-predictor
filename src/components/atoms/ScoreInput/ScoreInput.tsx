import React from "react";
import { Fixture } from "@prisma/client";
import styled from "styled-components";

import pageSizes from "../../../styles/pageSizes";

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
    disabled={!isScoreEditable}
    isScoreEditable={isScoreEditable}
    maxLength={1}
    name={`${isHome ? "home" : "away"}-score-${fixtureId}`}
    onChange={(e) => updateGoals(fixtureId, isHome, e.target.value)}
    type="text"
    value={goals}
    className={className}
  />
);

const Input = styled.input<StyleProps>`
  font-size: 2em;
  text-align: center;
  border: 0;
  width: 2em;
  background-color: inherit;
  :focus {
    outline: none;
  }

  @media (max-width: ${pageSizes.tablet}) {
    font-size: 1.2em;
  }

  @media (max-width: ${pageSizes.mobileM}) {
    font-size: 1em;
  }
`;

export default ScoreInput;
