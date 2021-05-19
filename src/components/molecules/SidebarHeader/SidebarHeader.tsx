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
      <UserIcon initial="D" />
      <Username>
        {username.length > 16 ? `${username.substring(0, 14)}...` : username}
      </Username>
    </User>
    <IconContainer tabIndex={0}>
      <Icon
        onClick={handleClick}
        src="/images/Cross.svg"
        alt="exit"
        width="18.5"
        height="19.5"
      />
    </IconContainer>
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
  display: flex;
  align-items: center;
  padding-left: 16px;
`;

const Username = styled.p`
  margin-left: 16px;
  color: ${colours.grey200};
  font-size: 1.4em; // TODO: use font with consistent letter box-sizing, so we know how many letters to allow
  font-weight: 400;
`;

const IconContainer = styled.div`
  margin-right: 16px;
  display: flex;
  align-items: center;

  :focus,
  :hover {
    outline: 1px solid ${colours.grey100};
  }
`;

const Icon = styled(Image)`
  cursor: pointer;
`;

export default SidebarHeader;
