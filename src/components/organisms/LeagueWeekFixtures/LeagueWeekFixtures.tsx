import styled from "styled-components";
import React from "react";
import Link from "next/link";

import { FixtureWithUsersPredictions } from "@/types";
import LeagueWeekPrediction from "@/components/molecules/LeagueWeekPrediction";
import {
  formatFixtureKickoffTime,
  whenIsTheFixture,
} from "utils/kickoffDateHelpers";
import calculatePredictionScore from "../../../../utils/calculatePredictionScore";
import isPastDeadline from "../../../../utils/isPastDeadline";
import colours from "../../../styles/colours";
import pageSizes from "../../../styles/pageSizes";

export type Props = {
  fixtures: FixtureWithUsersPredictions[];
  weekId: number;
};

const LeagueWeekFixtures = ({ fixtures, weekId }: Props) => {
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
                <Fixture>
                  {homeTeam}
                  &nbsp;&nbsp;
                  {homeGoals} - {awayGoals}
                  &nbsp;&nbsp;
                  {awayTeam}
                </Fixture>
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
                {predictions.map((prediction, i) => {
                  let score = 0;
                  if (homeGoals !== null && awayGoals !== null) {
                    score = calculatePredictionScore(prediction, [
                      homeGoals,
                      awayGoals,
                    ]);
                  }

                  return (
                    <LeagueWeekPrediction
                      homeGoals={prediction[0] || 0}
                      awayGoals={prediction[1] || 0}
                      score={score}
                      isBigBoyBonus={!!prediction[2]}
                      key={i}
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
  font-family: "Nunito" sans-serif;
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

const Fixture = styled.div`
  flex-basis: 100%;
  text-align: center;
  font-size: 1.1rem;

  @media (max-width: ${pageSizes.tablet}) {
    font-size: 0.9rem;
  }
`;

const ClickableFixture = styled(Fixture)`
  :hover,
  :focus {
    color: ${colours.blue100};
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
