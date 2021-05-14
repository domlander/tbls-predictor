import React from "react";
import styled from "styled-components";

export interface Props {
  label: string;
  colour: string;
  backgroundColour: string;
}

const Chip = ({ label, colour, backgroundColour }: Props) => (
  <Container backgroundColour={backgroundColour}>
    <Label colour={colour}>{label}</Label>
  </Container>
);

const Container = styled.div<{ backgroundColour: Props["backgroundColour"] }>`
  background-color: ${({ backgroundColour }) => backgroundColour};
  border-radius: 0.6em;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 1.2em;
  width: 4.2em;
`;

const Label = styled.div<{ colour: Props["colour"] }>`
  color: ${({ colour }) => colour};
  height: 1.2em;
  font-size: 0.8em;
  text-align: center;
  font-family: "Nunito";
`;

export default Chip;
