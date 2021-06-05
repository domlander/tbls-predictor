import React from "react";
import styled from "styled-components";
import pageSizes from "../../../styles/pageSizes";
import Chip from "../Chip";
import colours from "../../../styles/colours";

interface StyleProps {
  alignText: "left" | "center" | "right";
  locked: boolean;
}

export type Props = StyleProps & {
  label: string | number;
  predictionScore?: number;
  className?: string;
};

const GridItem = ({
  label,
  predictionScore,
  className,
  alignText,
  locked,
}: Props) => (
  <>
    <Container alignText={alignText} locked={locked} className={className}>
      <span>{label}</span>
      {(predictionScore === 3 || predictionScore === 1) && (
        <ChipContainer>
          <Chip variant={predictionScore === 3 ? "perfect" : "correct"} />
        </ChipContainer>
      )}
    </Container>
  </>
);

const Container = styled.div<StyleProps>`
  position: relative;
  background-color: inherit;
  font-size: 2em;
  text-align: ${({ alignText }) => alignText};
  padding-left: ${({ alignText }) => (alignText === "left" ? "1em" : "0.4em")};
  padding-right: ${({ alignText }) =>
    alignText === "right" ? "1em" : "0.4em"};
  display: flex;
  justify-content: ${({ alignText }) => {
    if (alignText === "left") return "flex-start";
    if (alignText === "right") return "flex-end";
    return "center";
  }};
  align-items: center;

  @media (max-width: ${pageSizes.tablet}) {
    font-size: 1.2em;
  }

  @media (max-width: ${pageSizes.mobileM}) {
    font-size: 1em;
  }
`;

const ChipContainer = styled.div`
  position: absolute;
  left: -0.1em;
  bottom: -0.1em;
`;

export default GridItem;
