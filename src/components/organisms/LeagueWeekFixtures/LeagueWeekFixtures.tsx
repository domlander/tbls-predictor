import styled from "styled-components";
import React from "react";

import { FixtureWithUsersPredictions } from "@/types";
import Link from "next/link";
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
      {fixtures.map((fixture) => (
        <Container key={fixture.id}>
          <FixtureRow>
            <Kickoff>
              {formatFixtureKickoffTime(
                fixture.kickoff,
                firstFixtureKickoffTiming
              )}
            </Kickoff>
            {isPastDeadline(fixture.kickoff) ? (
              <Fixture>
                {fixture.homeTeam}
                &nbsp;&nbsp;
                {fixture.homeGoals} - {fixture.awayGoals}
                &nbsp;&nbsp;
                {fixture.awayTeam}
              </Fixture>
            ) : (
              <ClickableFixture>
                <Link href={`/predictions/${weekId}`}>
                  <a>
                    {fixture.homeTeam} vs {fixture.awayTeam}
                  </a>
                </Link>
              </ClickableFixture>
            )}
          </FixtureRow>
          {isPastDeadline(fixture.kickoff) ? (
            <PredictionRow>
              {fixture.predictions.map((prediction, i) => {
                const score =
                  fixture.homeGoals === null || fixture.awayGoals === null
                    ? 0
                    : calculatePredictionScore(prediction, [
                        fixture.homeGoals,
                        fixture.awayGoals,
                      ]);

                return (
                  <PredictionContainer key={i}>
                    <Prediction score={score}>
                      {prediction[0] || 0} - {prediction[1] || 0}
                    </Prediction>
                    {!!prediction[2] && ( // prediction is either 1 or 0, rather than true or false
                      <Prediction score={score} double>
                        {prediction[0] || 0} - {prediction[1] || 0}
                      </Prediction>
                    )}
                  </PredictionContainer>
                );
              })}
            </PredictionRow>
          ) : null}
        </Container>
      ))}
    </>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-items: stretch;
  background-color: ${colours.blackblue400opacity50};
  margin: 0.8em 0;
  padding: 0.8em;
  border-radius: 0.2em;
  font-family: "Nunito" sans-serif;
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

const PredictionContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Prediction = styled.div<{ score: number; double?: boolean }>`
  background-color: ${({ score }) => {
    if (score >= 3) return colours.gold500;
    if (score >= 1) return colours.green500;
    return "inherit";
  }};
  padding: 0.1em 0.5em;
  border-radius: 2em;
  margin-top: ${({ double }) => (double ? "2px" : "0")};
`;

export default LeagueWeekFixtures;
