import React from "react";
import styled from "styled-components";
import colours from "@/styles/colours";
import { formatDate } from "@/utils";
import { Fixture } from "@prisma/client";

interface Props {
  fixtureId: Fixture["id"];
  kickoff: Fixture["kickoff"];
  homeTeam: Fixture["homeTeam"];
  awayTeam: Fixture["awayTeam"];
  homeGoals: string;
  awayGoals: string;
  updateGoals(fixtureId: number, isHomeTeam: boolean, homeGoals: string): void;
}

const PredictionTableRow = ({
  fixtureId,
  kickoff,
  homeTeam,
  awayTeam,
  homeGoals,
  awayGoals,
  updateGoals,
}: Props) => (
  <TableRow>
    <Date>{formatDate(kickoff)}</Date>
    <HomeTeam>{homeTeam}</HomeTeam>
    <Score>
      <ScoreInput
        name={`home-score-${fixtureId}`}
        type="text"
        maxLength={1}
        value={homeGoals}
        onChange={(e) => updateGoals(fixtureId, true, e.target.value)}
      />
    </Score>
    <Score>
      <ScoreInput
        name={`away-score-${fixtureId}`}
        type="text"
        maxLength={1}
        value={awayGoals}
        onChange={(e) => updateGoals(fixtureId, false, e.target.value)}
      />
    </Score>
    <AwayTeam>{awayTeam}</AwayTeam>
  </TableRow>
);
const TableRow = styled.tr`
  height: 1.5rem;
`;

const Td = styled.td`
  border: 1px solid ${colours.grey300};
`;

const Date = styled(Td)`
  width: 5em;
  text-align: center;
`;

const TeamName = styled(Td)``;

const HomeTeam = styled(TeamName)`
  text-align: end;
  padding-right: 1em;
`;

const AwayTeam = styled(TeamName)`
  padding-left: 1em;
`;

const Score = styled(Td)`
  width: 1.5rem;
`;

const ScoreInput = styled.input`
  width: 1em;
  height: 1em;
  border: none;
  display: block;
  margin: 0 auto;
  text-align: center;

  &:focus {
    outline: none;
  }
`;

export default PredictionTableRow;
