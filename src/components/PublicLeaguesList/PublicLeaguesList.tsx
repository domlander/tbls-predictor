import React from "react";
import Link from "next/link";
import styled from "styled-components";

import League from "src/types/League";
import colours from "src/styles/colours";
import Heading from "src/components/Heading";

export interface Props {
  leagues: League[];
}

const PublicLeaguesList = ({ leagues }: Props) => {
  if (!leagues?.length) return null;

  return (
    <Container>
      <Heading level="h2">Public leagues</Heading>
      <List>
        {leagues.map((league) => (
          <ListElement key={league.id}>
            <Link href={`league/${league.id}`}>
              <a>{league.name}</a>
            </Link>
          </ListElement>
        ))}
      </List>
    </Container>
  );
};

const Container = styled.div`
  font-size: 1rem;
`;

const List = styled.ul`
  padding-left: 0.2em;
  display: flex;
  flex-direction: column;
  gap: 1em;
`;

const ListElement = styled.li`
  list-style: none;
  text-decoration: underline;
  text-underline-offset: 2px;
  width: fit-content;

  :hover,
  :focus {
    color: ${colours.cyan100};
    text-decoration: none;
  }
`;

export default PublicLeaguesList;
