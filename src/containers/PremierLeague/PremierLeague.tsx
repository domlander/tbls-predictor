import React from "react";
import type { PremierLeagueTeamDisplay } from "src/types/PremierLeagueTeam";
import styled from "styled-components";

interface Props {
  teams: PremierLeagueTeamDisplay[];
}

const PremierLeague = ({ teams }: Props) => {
  return (
    <Container>
      <Table>
        <div>Club</div>
        <div>P</div>
        <div>W</div>
        <div>D</div>
        <div>L</div>
        <div>GF</div>
        <div>GA</div>
        <div>GD</div>
        <div>Pts</div>
        {teams.map(
          ({
            team,
            played,
            wins,
            draws,
            losses,
            goalsScored,
            goalsConceded,
            goalDifference,
            points,
          }) => {
            return (
              <>
                <div>{team}</div>
                <div>{played}</div>
                <div>{wins}</div>
                <div>{draws}</div>
                <div>{losses}</div>
                <div>{goalsScored}</div>
                <div>{goalsConceded}</div>
                <div>{goalDifference}</div>
                <div>{points}</div>
              </>
            );
          }
        )}
      </Table>
    </Container>
  );
};

const Container = styled.section`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  max-width: 800px;
`;

const Table = styled.div`
  display: grid;
  grid-template-columns: 11em repeat(8, 2em);
  grid-auto-rows: 4em;
`;

export default PremierLeague;
