import { KeyboardEvent } from "react";
import Fixture from "src/types/Fixture";
import styled from "styled-components";
import colours from "src/styles/colours";

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

const preventNonNumericInputs = (event: KeyboardEvent<HTMLInputElement>) => {
  if (
    // Number keys
    event.key !== "0" &&
    event.key !== "1" &&
    event.key !== "2" &&
    event.key !== "3" &&
    event.key !== "4" &&
    event.key !== "5" &&
    event.key !== "6" &&
    event.key !== "7" &&
    event.key !== "8" &&
    event.key !== "9" &&
    // Editing Keys
    event.key !== "Backspace" &&
    event.key !== "Clear" &&
    event.key !== "Cut" &&
    event.key !== "Delete" &&
    event.key !== "EraseEof" &&
    event.key !== "Insert" &&
    event.key !== "Paste" &&
    event.key !== "Redo" &&
    event.key !== "Undo" &&
    // UI keys
    event.key !== "Tab" &&
    event.key !== "Escape"
  ) {
    event?.preventDefault();
  }
};

const focusNextElement = (name: string, value: string) => {
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
      onChange={(event) => {
        const matchSingleDigitOrEmptyStringRegex = /^$|^[0-9]$/;
        if (matchSingleDigitOrEmptyStringRegex.test(event.target.value)) {
          updateGoals(fixtureId, isHome, event.target.value);
        }

        focusNextElement(name, event.target.value);
      }}
      onFocus={(event) => event.target.select()}
      onKeyDown={preventNonNumericInputs}
      type="number"
      value={goals}
      className={className}
      pattern="[0-9]"
      inputMode="numeric"
    />
  );
};

const Input = styled.input<StyleProps>`
  width: 2em;
  background-color: inherit;
  text-align: center;
  &:focus {
    outline: none;
  }
  &::placeholder {
    color: ${colours.grey500opacity50};
  }

  // Hide arrows
  /* Chrome, Safari, Edge, Opera */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  -moz-appearance: textfield;
`;

export default ScoreInput;
