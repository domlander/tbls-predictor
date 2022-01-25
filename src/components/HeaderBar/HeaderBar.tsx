import React from "react";
import Link from "next/link";
import styled from "styled-components";

import pageSizes from "src/styles/pageSizes";
import UserIcon from "src/components/UserIcon";
import colours from "src/styles/colours";

export interface Props {
  initial: string;
  handleClick?: () => void;
}

const HeaderBar = ({ initial, handleClick }: Props) => (
  <Container>
    <HeaderLinks>
      <Link href="/" passHref>
        <HeaderLink tabIndex={0}>Home</HeaderLink>
      </Link>
      <Link href="/predictions" passHref>
        <HeaderLink tabIndex={0}>Predictions</HeaderLink>
      </Link>
      <Link href="/leagues" passHref>
        <HeaderLink tabIndex={0}>Leagues</HeaderLink>
      </Link>
    </HeaderLinks>
    <UserIconContainer>
      <UserIcon initial={initial} handleClick={handleClick} />
    </UserIconContainer>
  </Container>
);

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--header-background);
  height: 4rem;
  font-size: 0.9rem;

  @media (max-width: ${pageSizes.tablet}) {
    height: 3rem;
    font-size: 0.7rem;
  }
`;

const HeaderLinks = styled.div``;

const HeaderLink = styled.a`
  color: ${colours.grey400};
  font-size: 1.2em;
  cursor: pointer;
  margin-left: 4em;
  :first-child {
    margin-left: 2em;
  }

  :hover,
  :focus {
    color: ${colours.cyan100};
  }

  @media (max-width: ${pageSizes.mobileL}) {
    margin-left: 3em;
  }
`;

const UserIconContainer = styled.div`
  margin-right: 1rem;
`;

export default HeaderBar;
