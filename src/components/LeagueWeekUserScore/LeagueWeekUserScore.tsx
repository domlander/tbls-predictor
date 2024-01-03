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
  font-size: 2.6rem;
  line-height: 2.6rem;
  letter-spacing: 0.05em;

  @media (max-width: 768px) {
    font-size: 2rem;
    line-height: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.6rem;
    line-height: 1.6rem;
  }
`;

export default LeagueWeekUserScore;
