"use client";

import styled from "styled-components";
import Link from "next/link";
import { Suspense } from "react";

import type Fixture from "src/types/Fixture";
import type TeamFixtures from "src/types/TeamFixtures";
import MyLeagues from "src/components/MyLeagues";
import pageSizes from "src/styles/pageSizes";
import colours from "src/styles/colours";
import Heading from "src/components/Heading";
import UserLeague from "src/types/UserLeague";
import UserStats from "src/components/UserStats";
import Prediction from "src/types/Prediction";
import Predictions from "../Predictions";

interface Props {
  weekId: number;
  fixtures: Fixture[];
  predictions: Prediction[];
  recentFixturesByTeam: TeamFixtures[];
  activeLeagues: UserLeague[];
}

const Home = ({
  weekId,
  fixtures,
  predictions,
  recentFixturesByTeam,
  activeLeagues,
}: Props) => {
  return (
    <Container>
      <PredictionsContainer>
        <PredictionsHeader>
          <Heading level="h2" as="h1" variant="secondary">
            Gameweek {weekId}
          </Heading>
          <Link href={`/predictions/${weekId}`}>All predictions</Link>
        </PredictionsHeader>
        <Predictions
          fixtures={fixtures}
          predictions={predictions}
          weekId={weekId}
          recentFixturesByTeam={recentFixturesByTeam}
        />
      </PredictionsContainer>
      <Suspense fallback={<p>Loading your stats...</p>}>
        <UserStats />
      </Suspense>
      <MyLeagues leagues={activeLeagues} loading={false} />
    </Container>
  );
};

export default Home;

const Container = styled.div`
  padding-top: 6em;
  padding-bottom: 6em;
  display: flex;
  flex-direction: column;
  gap: 6em;
  max-width: 800px;

  @media (max-width: ${pageSizes.tablet}) {
    padding: 4em 0;
  }
`;

const PredictionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4em;
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

    &:hover,
    &:focus {
      color: ${colours.cyan100};
    }

    @media (max-width: ${pageSizes.tablet}) {
      font-size: 0.8rem;
    }
  }
`;
