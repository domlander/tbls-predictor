import React from "react";
import type PremierLeagueTeam from "src/types/PremierLeagueTeam";
import styled from "styled-components";

interface Props {
  teams: PremierLeagueTeam[];
}

const PremierLeague = ({ teams }: Props) => {
  return (
    <Container>
      {teams.map(({ team, points }) => {
        return (
          <div>
            {team}: {points}
          </div>
        );
      })}
    </Container>
  );
};

const Container = styled.section`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  max-width: 800px;
`;

export default PremierLeague;
