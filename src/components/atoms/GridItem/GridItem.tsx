import React from "react";
import styled from "styled-components";
import colours from "../../../styles/colours";
import PerfectChip from "../Chip/PerfectChip";
import CorrectChip from "../Chip/CorrectChip";

interface StyleProps {
  alignText: "left" | "center" | "right";
  locked: boolean;
}

export type Props = StyleProps & {
  label: string | number;
  predictionScore?: number;
};

const GridItem = ({ label, predictionScore, alignText, locked }: Props) => (
  <>
    <Container alignText={alignText} locked={locked}>
      <p>{label}</p>
      {(predictionScore === 3 || predictionScore === 1) && (
        <ChipContainer>
          {predictionScore === 3 ? <PerfectChip /> : <CorrectChip />}
        </ChipContainer>
      )}
    </Container>
  </>
);

const Container = styled.div<StyleProps>`
  position: relative;
  background-color: ${colours.blackblue400};
  color: ${({ locked }) => (locked ? colours.grey400 : colours.grey100)};
  font-size: 1em;
  line-height: 1.2em;
  height: 3em;
  text-align: ${({ alignText }) => alignText};
  padding-left: ${({ alignText }) => (alignText === "left" ? "1.6em" : 0)};
  padding-right: ${({ alignText }) => (alignText === "right" ? "1.6em" : 0)};
`;

const ChipContainer = styled.div`
  position: absolute;
  left: -0.1em;
  bottom: -0.1em;
`;

export default GridItem;
