"use client";

import styled from "styled-components";
import Heading from "src/components/Heading";
import MyLeagues from "src/components/MyLeagues";
import UserLeague from "src/types/UserLeague";

type Props = {
  activeLeagues: UserLeague[];
};

const Leagues = ({ activeLeagues }: Props) => {
  return (
    <Container>
      <LeaguesHeading level="h1" variant="secondary">
        Leagues
      </LeaguesHeading>
      <MyLeagues leagues={activeLeagues} loading={false} />
    </Container>
  );
};

const Container = styled.section`
  display: flex;
  flex-direction: column;
  gap: 4em;
`;

const LeaguesHeading = styled(Heading)`
  margin: 1em 0 0 0;
`;

export default Leagues;
