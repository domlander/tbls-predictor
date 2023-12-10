"use client";

import styled from "styled-components";

import UserLeague from "src/types/UserLeague";
import Heading from "src/components/Heading";
import LeaguesCardsList from "../LeaguesCardsList";

export interface Props {
  leagues: UserLeague[];
}

const MyFinishedLeagues = ({ leagues }: Props) => {
  return (
    <Container>
      <Heading level="h2" variant="secondary">
        Finished leagues
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

export default MyFinishedLeagues;
