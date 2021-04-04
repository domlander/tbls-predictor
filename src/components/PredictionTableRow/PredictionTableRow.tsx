import React, { useState } from "react";
import styled from "styled-components";
import colours from "@/styles/colours";
import { formatDate } from "@/utils";
import { FixtureWithPrediction } from "@/types";

interface Props {
  fixture: FixtureWithPrediction;
}

const PredictionTableRow = ({
  fixture: {
    fixtureId,
    kickoff,
    homeTeam,
    awayTeam,
    homeGoals: initialHomeGoals,
    awayGoals: initialAwayGoals,
  },
}: Props) => {
  const [homeGoals, setHomeGoals] = useState(
    initialHomeGoals?.toString() || ""
  );
  const [awayGoals, setAwayGoals] = useState(
    initialAwayGoals?.toString() || ""
  );

  return (
    <TableRow>
      <Date>{formatDate(kickoff)}</Date>
      <HomeTeam>{homeTeam}</HomeTeam>
      <Score>
        <ScoreInput
          name={`home-score-${fixtureId}`}
          type="text"
          maxLength={1}
          value={homeGoals}
          onChange={(e) => setHomeGoals(e.target.value)}
        />
      </Score>
      <Score>
        <ScoreInput
          name={`away-score-${fixtureId}`}
          type="text"
          maxLength={1}
          value={awayGoals}
          onChange={(e) => setAwayGoals(e.target.value)}
        />
      </Score>
      <AwayTeam>{awayTeam}</AwayTeam>
    </TableRow>
  );
};

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
