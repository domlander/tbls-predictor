import styled from "styled-components";
import React from "react";

import { FixtureWithUsersPredictions } from "@/types";
import Link from "next/link";
import { formatFixtureKickoffTime } from "../../../utils/formatFixtureKickoffTime";
import calculatePredictionScore from "../../../../utils/calculatePredictionScore";
import isPastDeadline from "../../../../utils/isPastDeadline";
import colours from "../../../styles/colours";
import pageSizes from "../../../styles/pageSizes";

export type Props = {
  fixtures: FixtureWithUsersPredictions[];
  weekId: number;
};

const LeagueWeekFixtures = ({ fixtures, weekId }: Props) => (
  <>
    {fixtures.map((fixture) => (
      <Container key={fixture.id}>
        <FixtureRow>
          <Kickoff>{formatFixtureKickoffTime(fixture.kickoff)}</Kickoff>
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
              const score = calculatePredictionScore(prediction, [
                fixture.homeGoals as number,
                fixture.awayGoals as number,
              ]);
              return (
                <Prediction key={i} score={score}>
                  {prediction[0] || 0} - {prediction[1] || 0}
                </Prediction>
              );
            })}
          </PredictionRow>
        ) : null}
      </Container>
    ))}
  </>
);

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-items: stretch;
  background-color: ${colours.blackblue500opacity50};
  margin: 8px 0;
  padding: 8px;
  border-radius: 4px;
  font-family: "Nunito" sans-serif;
`;

const FixtureRow = styled.div`
  width: 100%;
  display: flex;
`;

const Kickoff = styled.div`
  flex-basis: 100px;
  text-align: center;
  align-self: center;
  font-size: 13px;
`;

const Fixture = styled.div`
  flex-basis: 100%;
  text-align: center;
  font-size: 18px;

  @media (max-width: ${pageSizes.tablet}) {
    font-size: 15px;
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
  margin-top: 8px;
  font-size: 18px;

  @media (max-width: ${pageSizes.tablet}) {
    font-size: 15px;
  }
`;

const Prediction = styled.div<{ score: number }>`
  background-color: ${({ score }) => {
    if (score === 3) return colours.gold500;
    if (score === 1) return colours.green500;
    return "inherit";
  }};
  padding: 2px 8px;
  border-radius: 12px;
`;

export default LeagueWeekFixtures;
