import React from "react";
import styled from "styled-components";
import colours from "../../../styles/colours";

interface OtherProps {
  label: string;
}

interface StyleProps {
  backgroundColour: string;
  height: number;
  width: number;
}

export type Props = StyleProps & OtherProps;

const Chip = ({ backgroundColour, height, label, width }: Props) => (
  <ChipOuter backgroundColour={backgroundColour} height={height} width={width}>
    <ChipInner>{label}</ChipInner>
  </ChipOuter>
);

const ChipOuter = styled.div<StyleProps>`
  background-color: ${({ backgroundColour }) => backgroundColour};
  border-radius: ${({ height }) => `${height / 2}px`};
  display: flex;
  justify-content: center;
  align-items: flex-end;
  height: ${({ height }) => `${height}px`};
  width: ${({ width }) => `${width}px`};
`;

const ChipInner = styled.div`
  color: ${colours.grey100};
  font-size: 8px;
  text-align: center;
  font-family: "Hind Madurai";
`;

export default Chip;
