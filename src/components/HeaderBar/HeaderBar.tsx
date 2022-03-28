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
      <ul>
        <li>
          <Link href="/" passHref>
            <a>Home</a>
          </Link>
        </li>
        <li>
          <Link href="/predictions" passHref>
            <a>Predictions</a>
          </Link>
        </li>
        <li>
          <Link href="/leagues" passHref>
            <a>Leagues</a>
          </Link>
        </li>
      </ul>
    </HeaderLinks>
    <UserIcon initial={initial} handleClick={handleClick} />
  </Container>
);

const Container = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--header-background);
  height: 4rem;
  font-size: 0.9rem;
  padding-right: 1em;

  @media (max-width: ${pageSizes.tablet}) {
    height: 3rem;
    font-size: 0.7rem;
  }
`;

const HeaderLinks = styled.nav`
  width: 100%;

  ul {
    display: flex;
    gap: 4em;
    margin-left: 2em;
    width: fit-content;
  }

  li {
    color: ${colours.grey400};
    font-size: 1.2em;
    cursor: pointer;

    @media (max-width: ${pageSizes.mobileL}) {
      margin-left: 3em;
    }
  }

  a {
    :hover,
    :focus {
      color: ${colours.cyan100};
    }
  }
`;

export default HeaderBar;
