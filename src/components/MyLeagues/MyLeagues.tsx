import React from "react";
import styled from "styled-components";
import Link from "next/link";

import UserLeague from "src/types/UserLeague";
import colours from "src/styles/colours";
import Heading from "src/components/Heading";
import LeaguesCardsList from "../LeaguesCardsList";

export interface Props {
  leagues: UserLeague[];
}

const MyLeagues = ({ leagues }: Props) => {
  return !leagues?.length ? (
    <NoLeagues>
      <Link href="/league/join">
        <a>Join a league</a>
      </Link>
    </NoLeagues>
  ) : (
    <Container>
      <Heading level="h2" as="h1" variant="secondary">
        My leagues
      </Heading>
      <LeaguesCardsList leagues={leagues} />
    </Container>
  );
};

const Container = styled.section`
  display: flex;
  flex-direction: column;
  gap: 2em;
`;

const NoLeagues = styled.section`
  display: flex;
  flex-direction: column;
  font-size: 2.5em;
  margin-bottom: 2em;

  p {
    margin: 0;
  }

  a {
    margin-left: 0.1em;
    text-decoration: underline;
    text-underline-offset: 2px;

    :hover,
    :focus {
      color: ${colours.cyan100};
    }
  }
`;

export default MyLeagues;
