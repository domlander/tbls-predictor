import React from "react";
import Fixture from "src/types/Fixture";
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

const focusNextInput = (name: string, value: string) => {
  const inputs = document.querySelectorAll("input");
  const thisInput = Array.from(inputs)
    .map((input) => input.name)
    .indexOf(name);
  const lastInput = thisInput === inputs.length - 1;

  if (/[0-9]/.test(value)) {
    if (!lastInput) {
      inputs[thisInput + 1].focus();
      inputs[thisInput + 1].select();
    } else {
      const saveButton = document.querySelector(
        "#save"
      ) as HTMLButtonElement | null;
      if (saveButton) saveButton.focus();
    }
  }
};

const ScoreInput = ({
  fixtureId,
  goals,
  isHome,
  isScoreEditable,
  updateGoals,
  className,
}: Props) => {
  const name = `${isHome ? "home" : "away"}-score-${fixtureId}`;

  return (
    <Input
      autoComplete="off"
      placeholder={isScoreEditable ? "?" : ""}
      disabled={!isScoreEditable}
      isScoreEditable={isScoreEditable}
      maxLength={1}
      name={name}
      onChange={(e) => {
        updateGoals(fixtureId, isHome, e.target.value);
        focusNextInput(name, e.target.value);
      }}
      type="number"
      value={goals}
      className={className}
      pattern="[0-9]"
      inputMode="numeric"
    />
  );
};

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
