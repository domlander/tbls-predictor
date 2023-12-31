"use client";

import { chivoMono } from "app/fonts";
import styled from "styled-components";
import pageSizes from "src/styles/pageSizes";

export type Props = {
  score: number;
};

const LeagueWeekUserScore = ({ score }: Props) => (
  <Total className={chivoMono.className}>{score}</Total>
);

const Total = styled.div`
  font-size: 4em;
  line-height: 1.4em;
  letter-spacing: 0.05em;
  margin-bottom: 0.4em;

  @media (max-width: ${pageSizes.tablet}) {
    font-size: 3em;
  }
`;

export default LeagueWeekUserScore;
