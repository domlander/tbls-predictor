import React from "react";
import styled from "styled-components";
import colours from "../../../styles/colours";

export interface Props {
  initial: string;
  handleClick: (e: React.MouseEvent) => void;
}

const UserIcon = ({ initial, handleClick }: Props) => (
  <Circle onClick={handleClick}>
    <Name>{initial}</Name>
  </Circle>
);

const Circle = styled.button`
  background-color: ${colours.blackblue400};
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: right;
  height: 3.2em;
  width: 3.2em;
`;

const Name = styled.p`
  color: ${colours.blue100};
  font-size: 1.8em;
`;

export default UserIcon;
