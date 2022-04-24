import React from "react";
import styled from "styled-components";

import useUserLeagues from "src/hooks/useUserLeagues";
import League from "src/types/League";
import Loading from "src/components/Loading";
import Heading from "src/components/Heading";
import MyLeagues from "src/components/MyLeagues";
// import PublicLeaguesList from "src/components/PublicLeaguesList";
import MyFinishedLeagues from "src/components/MyFinishedLeagues";

interface Props {
  publicLeagues: League[];
}

const Leagues = ({ publicLeagues }: Props) => {
  const [activeLeagues, finishedLeagues, loading, error] = useUserLeagues();

  if (loading) return <Loading />;
  if (error) return <div>An error has occurred. Please try again later.</div>;

  return (
    <Container>
      <LeaguesHeading level="h1" variant="secondary">
        Leagues
      </LeaguesHeading>
      <MyLeagues leagues={activeLeagues} />
      {finishedLeagues?.length ? (
        <MyFinishedLeagues leagues={finishedLeagues} />
      ) : null}
      {/* <PublicLeaguesList leagues={publicLeagues} /> */}
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
