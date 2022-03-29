import React from "react";
import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";

import Fixture from "src/types/Fixture";
import useUserLeagues from "src/hooks/useUserLeagues";
import LeaguesList from "src/components/LeagueList";
import pageSizes from "src/styles/pageSizes";
import colours from "src/styles/colours";
import Heading from "src/components/Heading";
import Predictions from "../Predictions";

interface Props {
  weekId: number;
  fixtures: Fixture[];
}

export default function Home({ weekId, fixtures }: Props) {
  const [userLeagues, leaguesLoading, leaguesError] = useUserLeagues();

  return (
    <Container>
      <PredictionsSection>
        <PredictionsHeader>
          <Heading level="h2" variant="secondary">
            This week
          </Heading>
          <Link href={`/predictions/${weekId}`}>
            <a>All predictions</a>
          </Link>
        </PredictionsHeader>
        <Predictions fixtures={fixtures} weekId={weekId} />
      </PredictionsSection>
      {leaguesLoading ? (
        <SpinnerContainer>
          <Image src="/images/spinner.gif" height="50" width="50" alt="" />
        </SpinnerContainer>
      ) : leaguesError ? (
        <LeagueError>
          Sorry, we could not load leagues at this time. Refresh the page or try
          again later.
        </LeagueError>
      ) : (
        <LeaguesList leagues={userLeagues} />
      )}
    </Container>
  );
}

const Container = styled.div`
  padding-top: 6em;
  padding-bottom: 6em;
  display: flex;
  flex-direction: column;
  gap: 5em;

  @media (max-width: ${pageSizes.tablet}) {
    padding: 4em 0;
  }
`;

const PredictionsSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 2em;
`;

const PredictionsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  a {
    font-size: 1.2rem;
    color: ${colours.grey300};
    cursor: pointer;
    text-decoration: underline;
    text-underline-offset: 1px;

    :hover,
    :focus {
      color: ${colours.cyan100};
    }

    @media (max-width: ${pageSizes.tablet}) {
      font-size: 0.8rem;
    }
  }
`;

const LeagueError = styled.p`
  font-size: 1rem;
`;

const SpinnerContainer = styled.div`
  height: 50px;
  width: 50px;
`;
