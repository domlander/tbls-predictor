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
                  {homeTeam}
                  &nbsp;&nbsp;
                  {homeGoals} - {awayGoals}
                  &nbsp;&nbsp;
                  {awayTeam}
                </UnclickableFixture>
              ) : (
                <ClickableFixture>
                  <Link href={`/predictions/${weekId}`}>
                    {homeTeam} vs {awayTeam}
                  </Link>
                </ClickableFixture>
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
  background-color: ${colours.blackblue400opacity50};
  margin: 0.4em 0;
  padding: 1.2em 0.8em 1.6em;
  border-radius: 0.2em;
`;

const FixtureRow = styled.div`
  width: 100%;
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
  text-decoration: underline;
  text-underline-offset: 2px;

  &:hover,
  &:focus {
    color: ${colours.cyan100};
  }
`;

const PredictionRow = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 1em;
  font-size: 1.1rem;

  @media (max-width: ${pageSizes.tablet}) {
    font-size: 0.8rem;
  }
`;

export default LeagueWeekFixtures;
