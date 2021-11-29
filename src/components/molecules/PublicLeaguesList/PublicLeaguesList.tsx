import { League } from "@prisma/client";
import React from "react";
import Link from "next/link";
import styled from "styled-components";
import colours from "@/styles/colours";

export interface Props {
  leagues: Partial<League>[];
}

const PublicLeaguesList = ({ leagues }: Props) => {
  return (
    <Container>
      <h2>Public leagues</h2>
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
  text-underline-offset: 0.2em;
  :hover {
    color: ${colours.cyan100};
    text-decoration: none;
  }
`;

export default PublicLeaguesList;
