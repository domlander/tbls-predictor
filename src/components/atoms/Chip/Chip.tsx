import React from "react";
import styled from "styled-components";
import colours from "../../../styles/colours";

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
};

export interface Props {
  variant: "perfect" | "correct";
}

const Chip = ({ variant }: Props) => (
  <Container variant={variant}>
    <Label variant={variant}>{variants[variant].label}</Label>
  </Container>
);

const Container = styled.div<Props>`
  background-color: ${({ variant }) => variants[variant].backgroundColour};
  border-radius: 0.6em;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 1.2em;
  width: 4.2em;
`;

const Label = styled.div<Props>`
  color: ${({ variant }) => variants[variant].colour};
  font-size: 0.7em;
  text-align: center;
  font-family: "Nunito sans";
`;

export default Chip;
