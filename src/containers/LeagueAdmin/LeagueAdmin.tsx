import React from "react";
import styled from "styled-components";

import { User } from "@prisma/client";
import LeagueApplicants from "@/components/LeagueApplicants";
import LeagueParticipants from "@/components/LeagueParticipants";
import HeaderBar from "@/components/molecules/HeaderBar";

interface Props {
  leagueId: number;
  name: string;
  applicants: User[];
  participants: User[];
}

const LeagueAdminContainer = ({
  leagueId,
  name,
  applicants,
  participants,
}: Props) => (
  <Container>
    <HeaderBar initial="D" />
    <Title>{name}</Title>
    <Subtitle>Requests</Subtitle>
    <LeagueApplicants applicants={applicants} leagueId={leagueId} />
    <LeagueParticipants participants={participants} />
  </Container>
);

const Container = styled.div`
  margin: 0 0.2rem;
`;

const Title = styled.h1`
  color: purple;
`;

const Subtitle = styled.h2`
  color: green;
`;

export default LeagueAdminContainer;
