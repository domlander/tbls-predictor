import styled from "styled-components";

import useUserLeagues from "src/hooks/useUserLeagues";
import Heading from "src/components/Heading";
import MyLeagues from "src/components/MyLeagues";
import MyFinishedLeagues from "src/components/MyFinishedLeagues";

const Leagues = () => {
  const [activeLeagues, finishedLeagues, loading, error] = useUserLeagues();

  if (error) return <div>An error has occurred. Please try again later.</div>;

  return (
    <Container>
      <LeaguesHeading level="h1" variant="secondary">
        Leagues
      </LeaguesHeading>
      <MyLeagues leagues={activeLeagues} loading={loading} />
      {!loading && finishedLeagues?.length ? (
        <MyFinishedLeagues leagues={finishedLeagues} />
      ) : null}
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
