import React from "react";
import styled, { css } from "styled-components";
import colours from "../../../styles/colours";

export interface Props {
  initial: string;
  handleClick?: () => void;
}

const UserIcon = ({ initial, handleClick }: Props) =>
  handleClick ? (
    <ClickableCircle onClick={handleClick} tabIndex={0}>
      <Name>{initial.toUpperCase()}</Name>
    </ClickableCircle>
  ) : (
    <Circle>
      <Name>{initial.toUpperCase()}</Name>
    </Circle>
  );

const sharedCircleStyles = css`
  background-color: ${colours.blackblue400};
  color: ${colours.cyan300};
  border-radius: 50%;
  border: 0.1em solid ${colours.cyan300};
  display: flex;
  justify-content: center;
  align-items: center;
  height: 3.2em;
  width: 3.2em;
`;

const ClickableCircle = styled.button`
  cursor: pointer;
  ${sharedCircleStyles}

  :focus, :hover {
    color: ${colours.blackblue500};
    background-color: ${colours.cyan300};
  }
`;

const Circle = styled.div`
  ${sharedCircleStyles}
`;

const Name = styled.p`
  font-size: 1.8em;
`;

export default UserIcon;
