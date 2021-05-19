import React from "react";
import Link from "next/link";
import styled from "styled-components";

import pageSizes from "../../../styles/pageSizes";
import UserIcon from "../../atoms/UserIcon";
import colours from "../../../styles/colours";

export interface Props {
  initial: string;
  handleClick?: () => void;
}

const HeaderBar = ({ initial, handleClick }: Props) => (
  <Container>
    <HeaderLinks>
      <Link href="/predictions" passHref tabIndex={0}>
        <HeaderLink>Predictions</HeaderLink>
      </Link>
      <Link href="/leagues" passHref tabIndex={0}>
        <HeaderLink>Leagues</HeaderLink>
      </Link>
    </HeaderLinks>
    <UserIconContainer>
      <UserIcon initial={initial} handleClick={handleClick} />
    </UserIconContainer>
  </Container>
);

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${colours.blackblue500};
  height: 70px;
  font-size: 14px;

  @media (max-width: ${pageSizes.tablet}) {
    font-size: 12px;
    height: 60px;
  }
`;

const HeaderLinks = styled.div``;

const HeaderLink = styled.a`
  color: ${colours.grey400};
  font-size: 1.2em;
  width: 70px;
  cursor: pointer;
  margin-left: 40px;
  :first-child {
    margin-left: 16px;
  }

  :hover,
  :focus {
    color: ${colours.blue100};
    text-decoration: underline;
  }
`;

const UserIconContainer = styled.div`
  margin-right: 16px;
`;

export default HeaderBar;
