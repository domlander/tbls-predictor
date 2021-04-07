import React from "react";
import styled from "styled-components";
import colours from "@/styles/colours";
import { formatUTCDate } from "@/utils";
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
}: Props) => {
  const now = new Date();
  const kickOffDate = new Date(kickoff);
  const deadline = new Date(
    kickOffDate.setUTCMinutes(kickOffDate.getUTCMinutes() - 90)
  );

  const predictionsLocked: boolean = now > deadline;

  return (
    <TableRow predictionsLocked={predictionsLocked}>
      <Kickoff>{formatUTCDate(kickoff)}</Kickoff>
      <HomeTeam>{homeTeam}</HomeTeam>
      <Score>
        <ScoreInput
          predictionsLocked={predictionsLocked}
          name={`home-score-${fixtureId}`}
          disabled={predictionsLocked}
          type="text"
          maxLength={1}
          value={homeGoals}
          onChange={(e) => updateGoals(fixtureId, true, e.target.value)}
        />
      </Score>
      <Score>
        <ScoreInput
          predictionsLocked={predictionsLocked}
          name={`away-score-${fixtureId}`}
          disabled={predictionsLocked}
          type="text"
          maxLength={1}
          value={awayGoals}
          onChange={(e) => updateGoals(fixtureId, false, e.target.value)}
        />
      </Score>
      <AwayTeam>{awayTeam}</AwayTeam>
    </TableRow>
  );
};

const TableRow = styled.tr<{ predictionsLocked: boolean }>`
  height: 1.5rem;
  color: ${({ predictionsLocked }) =>
    predictionsLocked ? colours.grey500 : "inherit"};
`;

const Td = styled.td`
  border: 1px solid ${colours.grey300};
`;

const Kickoff = styled(Td)`
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

const ScoreInput = styled.input<{ predictionsLocked: boolean }>`
  width: 1em;
  height: 1em;
  border: none;
  display: block;
  margin: 0 auto;
  text-align: center;
  color: ${({ predictionsLocked }) =>
    predictionsLocked ? colours.grey500 : "inherit"};

  &:focus {
    outline: none;
  }
`;

export default PredictionTableRow;
