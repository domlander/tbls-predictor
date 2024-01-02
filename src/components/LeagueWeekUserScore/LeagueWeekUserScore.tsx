"use client";

import { chivoMono } from "app/fonts";
import styled from "styled-components";

export type Props = {
  score: number;
};

const LeagueWeekUserScore = ({ score }: Props) => (
  <Total className={chivoMono.className}>{score}</Total>
);

const Total = styled.div`
  font-size: 4em;
  line-height: 1.6em;
  letter-spacing: 0.05em;

  @media (max-width: 768px) {
    font-size: 3em;
  }

  @media (max-width: 480px) {
    font-size: 2.4em;
  }
`;

export default LeagueWeekUserScore;
