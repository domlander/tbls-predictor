import React from "react";
import styled from "styled-components";
import colours from "../../../styles/colours";

const variants = {
  perfect: {
    label: "PERFECT",
    colour: colours.grey100,
    backgroundColour: colours.gold300,
  },
  correct: {
    label: "CORRECT",
    colour: colours.grey100,
    backgroundColour: colours.green300,
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
  height: 1.2em;
  font-size: 0.8em;
  text-align: center;
  font-family: "Nunito";
`;

export default Chip;
