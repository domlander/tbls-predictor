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
        <li>
          <Link href="/premierleague" passHref>
            <a>Table</a>
          </Link>
        </li>
      </ul>
    </HeaderLinks>
    <div>
      <UserIcon initial={initial} handleClick={handleClick} />
    </div>
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
  gap: 2em;

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
    margin-left: 4em;
    width: fit-content;

    @media (max-width: ${pageSizes.mobileL}) {
      gap: 3em;
      margin-left: 3em;
    }
  }

  li {
    color: ${colours.grey400};
    font-size: 1.2em;
    cursor: pointer;
  }

  // Select all header items excluding the first three

  @media (max-width: ${pageSizes.tablet}) {
    li:nth-child(n + 4) {
      display: none;
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
