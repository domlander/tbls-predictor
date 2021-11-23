import styled from "styled-components";
import React from "react";
import pageSizes from "../../../styles/pageSizes";

export type Props = {
  score: number;
};

const LeagueWeekUserTotals = ({ score }: Props) => <Total>{score}</Total>;

const Total = styled.div`
  font-family: "Patrick Hand", cursive;
  font-size: 4em;
  line-height: 1.4em;
  letter-spacing: 0.05em;

  @media (max-width: ${pageSizes.tablet}) {
    font-size: 3em;
  }
`;

export default LeagueWeekUserTotals;
