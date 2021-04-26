import React from "react";
import { ChipType } from "src/types/ChipType";
import styled from "styled-components";
import colours from "../../../styles/colours";

export const perfectChip: ChipType = {
  label: "PERFECT",
  backgroundColour: colours.gold300,
};

export const correctChip: ChipType = {
  label: "CORRECT",
  backgroundColour: colours.green300,
};

export interface Props {
  chipType: ChipType;
}

const Chip = ({ chipType }: Props) => (
  <ChipOuter chipType={chipType}>
    <ChipInner>{chipType.label}</ChipInner>
  </ChipOuter>
);

const ChipOuter = styled.div<Props>`
  background-color: ${({ chipType }) => chipType.backgroundColour};
  border-radius: 0.6em;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 1.2em;
  width: 4.2em;
`;

const ChipInner = styled.div`
  color: ${colours.grey100};
  height: 1.2em;
  font-size: 0.8em;
  text-align: center;
  font-family: "Nunito";
`;

export default Chip;
