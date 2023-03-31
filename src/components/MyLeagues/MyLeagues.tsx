import Link from "next/link";
import styled, { keyframes } from "styled-components";

import Heading from "src/components/Heading";
import LeaguesCardsList from "src/components/LeaguesCardsList";
import colours from "src/styles/colours";
import pageSizes from "src/styles/pageSizes";
import UserLeague from "src/types/UserLeague";

export interface Props {
  leagues: UserLeague[];
  loading: boolean;
}

const MyLeagues = ({ leagues, loading }: Props) => {
  if (!loading && !leagues?.length) {
    return (
      <NoLeagues>
        <Link href="/league/join">Join a league</Link>
      </NoLeagues>
    );
  }

  return (
    <Container>
      <Heading level="h2" as="h1" variant="secondary">
        My leagues
      </Heading>
      {loading ? (
        <LeaguesCardsSkeleton>
          <div />
        </LeaguesCardsSkeleton>
      ) : (
        <LeaguesCardsList leagues={leagues} />
      )}
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

const skeletonLoading = keyframes`
    0% {
      background-position: -800px 0
    }
    100% {
      background-position: 800px 0;
    }
`;

const LeaguesCardsSkeleton = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 400px);
  grid-gap: 3em;

  @media (max-width: ${pageSizes.tablet}) {
    grid-template-columns: 1fr;
  }

  div {
    height: 200px;
    border: 1px solid ${colours.grey500};
    animation: ${skeletonLoading} 1s linear infinite forwards;
    background: linear-gradient(
        to right,
        ${colours.blackblue400} 4%,
        ${colours.grey700} 25%,
        ${colours.blackblue400} 36%
      )
      0% 0% / 1500px 100%;
  }
`;

export default MyLeagues;
