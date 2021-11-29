import React from "react";
import styled from "styled-components";
import pageSizes from "../../../styles/pageSizes";
import Chip from "../Chip";

export type Props = {
  className?: string;
  isBbb?: boolean;
  label: string;
  predictionScore?: number;
};

const GridItem = ({
  className,
  isBbb = false,
  label,
  predictionScore,
}: Props) => (
  <Container className={className}>
    <span>{label}</span>
    {(isBbb || predictionScore) && (
      <ChipContainer>
        {predictionScore && predictionScore >= 1 && (
          <Chip variant={predictionScore >= 3 ? "perfect" : "correct"} />
        )}
        {isBbb && <Chip variant="bigBoyBonus" />}
      </ChipContainer>
    )}
  </Container>
);

const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background-color: inherit;
  padding-left: 0.4em;
  padding-right: 1em;

  font-size: 2em;
  @media (max-width: ${pageSizes.tablet}) {
    font-size: 1.2em;
  }
  @media (max-width: ${pageSizes.mobileL}) {
    font-size: 1.1em;
  }
  @media (max-width: ${pageSizes.mobileM}) {
    font-size: 1em;
  }

  span {
    text-align: right;
  }
`;

const ChipContainer = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  display: flex;
`;

export default GridItem;
