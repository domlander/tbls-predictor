import React from "react";
import styled from "styled-components";

import Header from "@/components/Header";
import { League, User } from "@prisma/client";

interface Props {
  leagueName: League["name"];
  participants: User[];
}

const LeagueTableContainer = ({ leagueName, participants }: Props) => (
  <Container>
    <Header />
    <Title>{leagueName}</Title>
    {participants.map((p) => (
      <div key={p.id}>{p.username}</div>
    ))}
  </Container>
);

const Container = styled.div``;

const Title = styled.h1`
  color: orange;
  font-size: 30px;
`;

export default LeagueTableContainer;
