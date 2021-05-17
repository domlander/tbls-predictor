import { League } from "@prisma/client";
import React from "react";
import styled from "styled-components";
import { useRouter } from "next/router";

import Heading from "../../atoms/Heading";
import colours from "../../../styles/colours";

export interface Props {
  leagues: Partial<League>[];
}

const LeaguesList = ({ leagues }: Props) => {
  const router = useRouter();
  if (!leagues?.length) return <p>No Leagues!</p>;

  return (
    <Leagues>
      {leagues.map(({ id, name }) => (
        <LeagueContainer key={id} onClick={() => router.push(`/league/${id}`)}>
          <LeagueCardHeading level="h2">{name}</LeagueCardHeading>
          <LeagueCardInfo>
            Current position: <span style={{ fontWeight: 700 }}>Unknown</span>
          </LeagueCardInfo>
          <LeagueCardInfo>
            Finish: <span style={{ fontWeight: 700 }}>Unknown</span>
          </LeagueCardInfo>
        </LeagueContainer>
      ))}
    </Leagues>
  );
};

const Leagues = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 400px);
  grid-gap: 16px;
`;

const LeagueContainer = styled.div`
  border: 1px solid ${colours.grey300};
  padding: 32px;
  cursor: pointer;

  :hover,
  :focus,
  :active {
    background-color: #ffffff10;
  }
`;

const LeagueCardHeading = styled(Heading)`
  margin: 0 0 32px;
`;

const LeagueCardInfo = styled.div`
  font-size: 2em;
  margin-top: 16px;
`;

export default LeaguesList;
