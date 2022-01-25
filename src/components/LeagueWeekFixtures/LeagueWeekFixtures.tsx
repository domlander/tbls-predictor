import React from "react";
import Link from "next/link";
import styled from "styled-components";

import {
  formatFixtureKickoffTime,
  whenIsTheFixture,
} from "utils/kickoffDateHelpers";
import Fixture from "src/types/Fixture";
import LeagueWeekPrediction from "src/components/LeagueWeekPrediction";
import colours from "src/styles/colours";
import pageSizes from "src/styles/pageSizes";
import isPastDeadline from "utils/isPastDeadline";

export type Props = {
  weekId: number;
  fixtures: Fixture[];
};

const LeagueWeekFixtures = ({ weekId, fixtures }: Props) => {
  const firstFixtureKickoffTiming = whenIsTheFixture(fixtures[0].kickoff);

  return (
    <>
      {fixtures.map(
        ({
          id,
          kickoff,
          homeTeam,
          awayTeam,
          homeGoals,
          awayGoals,
          predictions,
        }) => (
          <Container key={id}>
            <FixtureRow>
              <Kickoff>
                {formatFixtureKickoffTime(kickoff, firstFixtureKickoffTiming)}
              </Kickoff>
              {isPastDeadline(kickoff) ? (
                <UnclickableFixture>
                  {homeTeam}
                  &nbsp;&nbsp;
                  {homeGoals} - {awayGoals}
                  &nbsp;&nbsp;
                  {awayTeam}
                </UnclickableFixture>
              ) : (
                <ClickableFixture>
                  <Link href={`/predictions/${weekId}`}>
                    <a>
                      {homeTeam} vs {awayTeam}
                    </a>
                  </Link>
                </ClickableFixture>
              )}
            </FixtureRow>
            {isPastDeadline(kickoff) ? (
              <PredictionRow>
                {predictions?.map((prediction) => {
                  return (
                    <LeagueWeekPrediction
                      homeGoals={prediction.homeGoals || 0}
                      awayGoals={prediction.awayGoals || 0}
                      score={prediction.score || 0}
                      isBigBoyBonus={prediction.big_boy_bonus || false}
                      key={`${prediction.fixtureId}${prediction.user.id}`}
                    />
                  );
                })}
              </PredictionRow>
            ) : null}
          </Container>
        )
      )}
    </>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-items: stretch;
  background-color: ${colours.blackblue400opacity50};
  margin: 0.4em 0;
  padding: 1.2em 0.8em 1.6em;
  border-radius: 0.2em;
`;

const FixtureRow = styled.div`
  width: 100%;
  margin-bottom: 0.4em;
  display: flex;
`;

const Kickoff = styled.div`
  flex-basis: 8em;
  text-align: center;
  align-self: center;
  font-size: 0.8rem;
  color: ${colours.grey400};
`;

const StyledFixture = styled.div`
  flex-basis: 100%;
  text-align: center;
  font-size: 1.1rem;

  @media (max-width: ${pageSizes.tablet}) {
    font-size: 0.9rem;
  }
`;

const UnclickableFixture = styled(StyledFixture)``;

const ClickableFixture = styled(StyledFixture)`
  :hover,
  :focus {
    color: ${colours.cyan100};
    text-decoration: underline;
  }
`;

const PredictionRow = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 0.6em;
  font-size: 1.1rem;

  @media (max-width: ${pageSizes.tablet}) {
    font-size: 0.8rem;
  }
`;

export default LeagueWeekFixtures;
