import React from "react";
import styled from "styled-components";

import type Fixture from "src/types/Fixture";
import colours from "src/styles/colours";
import { getShortDateKickoffTime } from "utils/kickoffDateHelpers";
import getMatchResultText from "utils/getMatchResultText";

export type Props = {
  team: Fixture["homeTeam"];
  recentFixtures: Fixture[];
  isHome?: boolean;
};

const GridRowFormTeam = ({ team, recentFixtures, isHome = false }: Props) => {
  if (!recentFixtures.length) {
    return <NoForm isHome={isHome}>No previous matches</NoForm>;
  }

  return (
    <Form isHome={isHome}>
      {recentFixtures.map(
        ({ homeTeam, awayTeam, homeGoals, awayGoals, kickoff }) => {
          const teamGoals = team === homeTeam ? homeGoals : awayGoals;
          const oppoGoals = team === homeTeam ? awayGoals : homeGoals;

          const result = getMatchResultText(teamGoals, oppoGoals);

          return (
            <Match isHome={isHome}>
              <Result>
                {result} {homeGoals}-{awayGoals}{" "}
                {homeTeam === team ? `vs ${awayTeam}` : `at ${homeTeam}`}
              </Result>
              <KickoffDate isHome={isHome}>
                {getShortDateKickoffTime(kickoff)}
              </KickoffDate>
            </Match>
          );
        }
      )}
    </Form>
  );
};

const Form = styled.div<{ isHome: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.1em;
  padding-top: 0.4em;
  padding-bottom: 1em;
  align-items: ${({ isHome }) => (isHome ? "flex-end" : "flex-start")};
  padding-left: ${({ isHome }) => (isHome ? "0" : "1em")};
  padding-right: ${({ isHome }) => (isHome ? "1em" : "0")};
`;

const Match = styled.div<{ isHome: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: ${({ isHome }) => (isHome ? "row" : "row-reverse")};
  justify-content: flex-end;
  color: ${colours.grey300};
  font-size: 0.9rem;
  font-weight: 300;
`;

const Result = styled.div``;

const KickoffDate = styled.div<{ isHome: boolean }>`
  flex-basis: 4em;
  text-align: ${({ isHome }) => (isHome ? "end" : "start")};
  font-style: italic;
`;

const NoForm = styled.div<{ isHome: boolean }>`
  padding-top: 0.4em;
  padding-bottom: 1em;
  padding-left: ${({ isHome }) => (isHome ? "0" : "1.6em")};
  padding-right: ${({ isHome }) => (isHome ? "1.6em" : "0")};
  text-align: ${({ isHome }) => (isHome ? "end" : "start")};
  color: ${colours.grey300};
  font-size: 0.8rem !important;
  font-weight: 300;
`;

export default GridRowFormTeam;
