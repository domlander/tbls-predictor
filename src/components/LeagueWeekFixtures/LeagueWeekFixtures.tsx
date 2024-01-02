"use client";

import Link from "next/link";
import styled from "styled-components";

import { chivoMono } from "app/fonts";
import {
  formatFixtureKickoffTime,
  whenIsTheFixture,
} from "utils/kickoffDateHelpers";
import Fixture from "src/types/Fixture";
import LeagueWeekPrediction from "src/components/LeagueWeekPrediction";
import calculatePredictionScore from "utils/calculatePredictionScore";
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
                  <HomeTeam>{homeTeam}</HomeTeam>
                  <span className={chivoMono.className}>
                    {homeGoals}-{awayGoals}
                  </span>
                  <AwayTeam>{awayTeam}</AwayTeam>
                </UnclickableFixture>
              ) : (
                <Link href={`/predictions/${weekId}`}>
                  <ClickableFixture>
                    <HomeTeam>{homeTeam}</HomeTeam>
                    <span>&nbsp;&nbsp;vs&nbsp;&nbsp;</span>
                    <AwayTeam>{awayTeam}</AwayTeam>
                  </ClickableFixture>
                </Link>
              )}
            </FixtureRow>
            {isPastDeadline(kickoff) ? (
              <PredictionRow>
                {predictions?.map((prediction) => {
                  const predictedHomeGoals = prediction.homeGoals ?? 0;
                  const predictedAwayGoals = prediction.awayGoals ?? 0;
                  const bigBoyBonus = prediction.bigBoyBonus ?? false;
                  const score = calculatePredictionScore(
                    [predictedHomeGoals, predictedAwayGoals, bigBoyBonus],
                    [homeGoals, awayGoals]
                  );

                  return (
                    <LeagueWeekPrediction
                      homeGoals={predictedHomeGoals}
                      awayGoals={predictedAwayGoals}
                      score={score}
                      isBigBoyBonus={bigBoyBonus}
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
  background-color: var(--blackblue400opacity50);
  border-radius: 0.2em;
  padding: 1.6em 1em;
  gap: 1.2em;

  @media (max-width: 768px) {
    padding: 1.4em 1em;
    gap: 1em;
  }

  @media (max-width: 480px) {
    padding: 1.2em 1em;
    gap: 0.8em;
  }
`;

const FixtureRow = styled.div`
  width: 100%;
  display: flex;

  a {
    width: 100%;
  }
`;

const Kickoff = styled.div`
  flex-basis: 8em;
  text-align: center;
  align-self: center;
  color: var(--grey400);
  font-size: 0.8rem;

  @media (max-width: 480px) {
    font-size: 0.7rem;
  }
`;

const StyledFixture = styled.span`
  flex-basis: 100%;
  text-align: center;
  font-size: 1.1rem;
  color: var(--grey300);
  display: grid;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const UnclickableFixture = styled(StyledFixture)`
  grid-template-columns: 1fr 40px 1fr;
  gap: 0.5em;
`;

const ClickableFixture = styled(StyledFixture)`
  grid-template-columns: 1fr min-content 1fr;
  text-decoration: underline;
  text-underline-offset: 2px;

  &:hover,
  &:focus {
    color: var(--cyan200);
  }
`;

const HomeTeam = styled.span`
  text-align: right;
`;

const AwayTeam = styled.span`
  text-align: left;
`;

const PredictionRow = styled.div`
  display: flex;
  justify-content: space-around;
  font-size: 1.1rem;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

export default LeagueWeekFixtures;
