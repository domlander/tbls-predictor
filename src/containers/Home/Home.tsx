import styled from "styled-components";
import Link from "next/link";

import type Fixture from "src/types/Fixture";
import type TeamFixtures from "src/types/TeamFixtures";
import useUserLeagues from "src/hooks/useUserLeagues";
import MyLeagues from "src/components/MyLeagues";
import pageSizes from "src/styles/pageSizes";
import colours from "src/styles/colours";
import Heading from "src/components/Heading";
import Predictions from "../Predictions";

interface Props {
  weekId: number;
  fixtures: Fixture[];
  recentFixturesByTeam: TeamFixtures[];
  perfectPerc: number;
  correctPerc: number;
}

export default function Home({
  weekId,
  fixtures,
  recentFixturesByTeam,
  perfectPerc,
  correctPerc,
}: Props) {
  const [activeLeagues, _, loading, error] = useUserLeagues();

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
          weekId={weekId}
          recentFixturesByTeam={recentFixturesByTeam}
        />
      </PredictionsContainer>
      {perfectPerc &&
        correctPerc && ( // intentionally do not display if correct % is zero
          <StatsContainer>
            <Heading level="h2" as="h1" variant="secondary">
              My stats
            </Heading>
            <Stats>
              <Stat>
                <div>Perfect %</div>
                <StatPerc>{perfectPerc.toFixed(1)}</StatPerc>
              </Stat>
              <Stat>
                <div>Correct %</div>
                <StatPerc>{correctPerc.toFixed(1)}</StatPerc>
              </Stat>
            </Stats>
          </StatsContainer>
        )}
      {error ? (
        <LeagueError>
          Sorry, we could not load leagues at this time. Refresh the page or try
          again later.
        </LeagueError>
      ) : (
        <MyLeagues leagues={activeLeagues} loading={loading} />
      )}
    </Container>
  );
}

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

const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4em;
  margin-bottom: 4em;
`;

const Stats = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10em;
`;

const Stat = styled.div`
  font-size: 1.2rem;
`;

const StatPerc = styled.div`
  font-size: 2.6rem;
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
