import React from "react";
import styled from "styled-components";
import colours from "@/styles/colours";
import { formatFixtureKickoffTime } from "@/utils";
import { Fixture } from "@prisma/client";

interface Props {
  fixtureId: Fixture["id"];
  kickoff: Fixture["kickoff"];
  homeTeam: Fixture["homeTeam"];
  awayTeam: Fixture["awayTeam"];
  homeGoals: string;
  awayGoals: string;
  score: number | null;
  updateGoals(fixtureId: number, isHomeTeam: boolean, homeGoals: string): void;
  allowEditScore: boolean;
}

const scoreColours: { [id: number]: string } = {
  3: "#dbdea4",
  1: "#c4fdac",
  0: "#ffdad8",
};

const FixtureTableRow = ({
  fixtureId,
  kickoff,
  homeTeam,
  awayTeam,
  homeGoals,
  awayGoals,
  score,
  updateGoals,
  allowEditScore,
}: Props) => (
  <TableRow allowEditScore={allowEditScore}>
    <Kickoff score={score}>{formatFixtureKickoffTime(kickoff)}</Kickoff>
    <HomeTeam>{homeTeam}</HomeTeam>
    <Score>
      <ScoreInput
        allowEditScore={allowEditScore}
        name={`home-score-${fixtureId}`}
        disabled={!allowEditScore}
        type="text"
        maxLength={1}
        value={homeGoals}
        onChange={(e) => updateGoals(fixtureId, true, e.target.value)}
      />
    </Score>
    <Score>
      <ScoreInput
        allowEditScore={allowEditScore}
        name={`away-score-${fixtureId}`}
        disabled={!allowEditScore}
        type="text"
        maxLength={1}
        value={awayGoals}
        onChange={(e) => updateGoals(fixtureId, false, e.target.value)}
      />
    </Score>
    <AwayTeam>{awayTeam}</AwayTeam>
  </TableRow>
);

const TableRow = styled.tr<{ allowEditScore: boolean }>`
  height: 1.5rem;
  color: ${({ allowEditScore }) =>
    allowEditScore ? "inherit" : colours.grey500};
`;

const Td = styled.td`
  border: 1px solid ${colours.grey300};
`;

const Kickoff = styled(Td)<{ score: number | null }>`
  width: 6em;
  text-align: center;
  background: ${({ score }) =>
    score !== null ? scoreColours[score] : "inherit"};
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

const ScoreInput = styled.input<{ allowEditScore: boolean }>`
  width: 1em;
  height: 1em;
  border: none;
  display: block;
  margin: 0 auto;
  text-align: center;
  color: ${({ allowEditScore }) =>
    allowEditScore ? "inherit" : colours.grey500};

  &:focus {
    outline: none;
  }
`;

export default FixtureTableRow;
