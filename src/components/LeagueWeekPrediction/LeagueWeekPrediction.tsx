import styled from "styled-components";
import React from "react";

import colours from "src/styles/colours";

export type Props = {
  homeGoals: number;
  awayGoals: number;
  score: number;
  isBigBoyBonus: boolean;
};

const LeagueWeekPrediction = ({
  homeGoals,
  awayGoals,
  score,
  isBigBoyBonus,
}: Props) => {
  return (
    <PredictionContainer>
      <Prediction score={score}>
        {homeGoals} - {awayGoals}
      </Prediction>
      {isBigBoyBonus && (
        <Prediction score={score} isBigBoyBonus>
          {homeGoals} - {awayGoals}
        </Prediction>
      )}
    </PredictionContainer>
  );
};

const PredictionContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Prediction = styled.div<{ score: number; isBigBoyBonus?: boolean }>`
  background-color: ${({ score }) => {
    if (score >= 3) return colours.gold500;
    if (score >= 1) return colours.green500;
    return "inherit";
  }};
  color: ${colours.grey200};
  padding: 0.1em 0.5em;
  border-radius: 2em;
  margin-top: ${({ isBigBoyBonus }) => (isBigBoyBonus ? "2px" : "0")};
`;

export default LeagueWeekPrediction;
