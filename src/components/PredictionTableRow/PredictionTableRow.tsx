import React from "react";
import styled from "styled-components";
import colours from "@/styles/colours";
import { formatDate } from "@/utils";
import { Fixture } from "@prisma/client";

interface Props {
  fixture: Fixture;
}

const PredictionTableRow = ({ fixture }: Props) => (
  <TableRow key={fixture.id}>
    <Date>{formatDate(fixture.kickoff)}</Date>
    <HomeTeam>{fixture.homeTeam}</HomeTeam>
    <Score>
      <ScoreInput name={`home-score-${fixture.id}`} type="text" maxLength={1} />
    </Score>
    <Score>
      <ScoreInput name={`away-score-${fixture.id}`} type="text" maxLength={1} />
    </Score>
    <AwayTeam>{fixture.awayTeam}</AwayTeam>
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
