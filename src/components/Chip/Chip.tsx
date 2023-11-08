"use client";

import styled from "styled-components";
import colours from "src/styles/colours";

const variants = {
  perfect: {
    label: "PERFECT",
    colour: colours.grey100,
    backgroundColour: colours.gold500,
  },
  correct: {
    label: "CORRECT",
    colour: colours.grey100,
    backgroundColour: colours.green500,
  },
  bigBoyBonus: {
    label: "2X",
    colour: colours.grey100,
    backgroundColour: colours.red500,
  },
};

export interface Props {
  variant: "perfect" | "correct" | "bigBoyBonus";
}

const Chip = ({ variant }: Props) => (
  <Container variant={variant}>
    <Label variant={variant}>{variants[variant].label}</Label>
  </Container>
);

const Container = styled.div<Props>`
  background-color: ${({ variant }) => variants[variant].backgroundColour};
  border-radius: 2em;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 1.2em;
  width: ${({ variant }) => (variant === "bigBoyBonus" ? "2em" : "4.2em")};
`;

const Label = styled.div<Props>`
  color: ${({ variant }) => variants[variant].colour};
  font-size: 0.7em;
  text-align: center;
`;

export default Chip;
