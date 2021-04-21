import React from "react";
import styled from "styled-components";
import colours from "../../../styles/colours";
import Chip, { ChipType } from "../Chip";

interface StyleProps {
  alignText: "left" | "center" | "right";
}

export type Props = StyleProps & {
  label: string;
  chip?: ChipType;
};

const GridItem = ({ label, chip, alignText }: Props) => (
  <Container alignText={alignText}>
    {chip && (
      <ChipContainer>
        <Chip chipType={chip} />
      </ChipContainer>
    )}
    <LabelContainer>{label}</LabelContainer>
  </Container>
);

const Container = styled.div<StyleProps>`
  position: relative;
  border: 0.1em solid ${colours.grey400};
  background-color: ${colours.blackblue400};
  color: ${colours.grey100};
  font-size: 1em;
  height: 3em;
  text-align: ${({ alignText }) => alignText};
`;

const ChipContainer = styled.div`
  position: absolute;
  left: -0.1em;
  bottom: -0.1em;
`;

const LabelContainer = styled.div`
  padding: 0 1.6em;
`;

export default GridItem;
