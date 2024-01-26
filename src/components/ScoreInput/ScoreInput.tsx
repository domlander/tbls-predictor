"use client";

import { KeyboardEvent } from "react";
import { chivoMono } from "app/fonts";
import Fixture from "src/types/Fixture";
import styles from "./ScoreInput.module.css";

export type Props = {
  fixtureId: Fixture["id"];
  goals: string;
  className?: string;
  isHome: boolean;
  isTopRow: boolean;
  isEditable: boolean;
  updateGoals: (
    fixtureId: number,
    isHomeTeam: boolean,
    homeGoals: string
  ) => void;
};

const matchSingleDigitOrEmptyStringRegex = /^$|^[0-9]$/;

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
  isEditable,
  isTopRow,
  updateGoals,
}: Props) => {
  const name = `${isHome ? "home" : "away"}-score-${fixtureId}`;

  return (
    <input
      autoComplete="off"
      placeholder={isEditable ? "?" : ""}
      disabled={!isEditable}
      maxLength={1}
      name={name}
      onChange={(event) => {
        if (matchSingleDigitOrEmptyStringRegex.test(event.target.value)) {
          updateGoals(fixtureId, isHome, event.target.value);
        }

        focusNextElement(name, event.target.value);
      }}
      onFocus={(event) => event.target.select()}
      onKeyDown={preventNonNumericInputs}
      type="number"
      value={goals}
      className={[
        chivoMono.className,
        styles.input,
        isTopRow && styles.topRow,
        isEditable && styles.editable,
        isHome && styles.home,
      ].join(" ")}
      pattern="[0-9]"
      inputMode="numeric"
    />
  );
};

export default ScoreInput;
