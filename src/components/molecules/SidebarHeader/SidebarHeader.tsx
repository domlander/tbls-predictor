import React from "react";
import styled from "styled-components";
import Image from "next/image";
import UserIcon from "../../atoms/UserIcon";
import colours from "../../../styles/colours";

export interface Props {
  username: string;
  handleClick: () => void;
}

const SidebarHeader = ({ username, handleClick }: Props) => (
  <Container>
    <User>
      <UserIcon initial={username[0]} />
      <Username>{username}</Username>
    </User>
    <Icon
      onClick={handleClick}
      src="/images/Cross.svg"
      alt="exit"
      width="18.5"
      height="19.5"
    />
  </Container>
);

const Container = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${colours.blackblue500};
`;

const User = styled.div`
  margin-left: 16px;
  display: flex;
  align-items: center;
`;

const Username = styled.p`
  margin-left: 16px;
  color: ${colours.grey200};
  font-size: 1.8em;
  font-weight: 400;
`;

const Icon = styled(Image)`
  margin-right: 16px;
  cursor: pointer;
`;

export default SidebarHeader;
