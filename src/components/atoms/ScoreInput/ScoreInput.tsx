import React from "react";
import { Fixture } from "@prisma/client";
import styled from "styled-components";

import pageSizes from "../../../styles/pageSizes";
import colours from "../../../styles/colours";

interface StyleProps {
  isScoreEditable: boolean;
}

export type Props = StyleProps & {
  fixtureId: Fixture["id"];
  goals: string;
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
}: Props) => (
  <ScoreInputStyles
    autoComplete="off"
    disabled={!isScoreEditable}
    isScoreEditable={isScoreEditable}
    maxLength={1}
    name={`${isHome ? "home" : "away"}-score-${fixtureId}`}
    onChange={(e) => updateGoals(fixtureId, isHome, e.target.value)}
    type="text"
    value={goals}
  />
);

const ScoreInputStyles = styled.input<StyleProps>`
  color: ${({ isScoreEditable }) =>
    isScoreEditable ? colours.grey100 : colours.grey400};
  font-size: 2em;
  text-align: center;
  border: 0;
  width: 2.4em;
  background-color: ${colours.blackblue400};
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
