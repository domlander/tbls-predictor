import React from "react";
import styled, { css } from "styled-components";
import colours from "../../../styles/colours";

export interface Props {
  initial: string;
  handleClick?: (e: React.MouseEvent) => void;
}

const UserIcon = ({ initial, handleClick }: Props) =>
  handleClick ? (
    <ClickableCircle onClick={handleClick}>
      <Name>{initial}</Name>
    </ClickableCircle>
  ) : (
    <Circle>
      <Name>{initial}</Name>
    </Circle>
  );

const sharedCircleStyles = css`
  background-color: ${colours.blackblue400};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 3.2em;
  width: 3.2em;
`;
const ClickableCircle = styled.button`
  cursor: pointer;
  ${sharedCircleStyles}
`;

const Circle = styled.div`
  ${sharedCircleStyles}
`;

const Name = styled.p`
  color: ${colours.blue100};
  font-size: 1.8em;
`;

export default UserIcon;
