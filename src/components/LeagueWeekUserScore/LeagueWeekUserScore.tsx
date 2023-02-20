import styled from "styled-components";
import React from "react";
import pageSizes from "src/styles/pageSizes";
import { Patrick_Hand as PatrickHand } from "@next/font/google";

const patrickHand = PatrickHand({
  subsets: ["latin"],
  weight: "400",
});

export type Props = {
  score: number;
};

const LeagueWeekUserScore = ({ score }: Props) => (
  <Total className={patrickHand.className}>{score}</Total>
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
