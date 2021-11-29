import React from "react";
import styled from "styled-components";
import colours from "../../../styles/colours";
import pageSizes from "../../../styles/pageSizes";

export type Props = {
  className?: string;
  fixtureId: number;
  handleBbbUpdate?: (fixtureId: number) => void;
  isBbbLocked?: boolean;
  isBbbSelected?: boolean;
  label: string;
  locked: boolean;
};

const GridItem = ({
  className,
  fixtureId,
  handleBbbUpdate,
  isBbbLocked = false,
  isBbbSelected = false,
  label,
  locked,
}: Props) => (
  <Container isBbbLocked={isBbbLocked} className={className}>
    <span>{label}</span>
    {!locked && !isBbbLocked && handleBbbUpdate && (
      <BbbButton
        isBbbSelected={isBbbSelected}
        onClick={(e) => {
          e.preventDefault();
          handleBbbUpdate(fixtureId);
        }}
      >
        2X
      </BbbButton>
    )}
  </Container>
);

const Container = styled.div<{
  isBbbLocked: Props["isBbbLocked"];
}>`
  display: flex;
  justify-content: ${({ isBbbLocked }) =>
    !isBbbLocked ? "space-between" : "flex-start"};
  align-items: center;
  padding-left: 1em;
  padding-right: 0.4em;

  span {
    text-align: left;
  }
`;

const BbbButton = styled.button<{
  isBbbSelected: Props["isBbbSelected"];
}>`
  color: ${({ isBbbSelected }) =>
    isBbbSelected ? colours.blackblue500 : colours.cyan100};
  background-color: ${({ isBbbSelected }) =>
    isBbbSelected ? colours.cyan300 : colours.blackblue500};
  border: ${({ isBbbSelected }) =>
    `1px solid ${isBbbSelected ? colours.cyan300 : colours.cyan100}`};
  border-radius: 0.2em;

  padding: 0 0.5em;
  @media (max-width: ${pageSizes.mobileL}) {
    padding: 0 0.3em;
  }
`;

export default GridItem;
