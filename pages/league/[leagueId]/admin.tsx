import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import React from "react";
import styled from "styled-components";

import prisma from "prisma/client";
import { User } from "@prisma/client";
import Header from "@/components/Header";
import LeagueApplicants from "@/components/LeagueApplicants";
import LeagueParticipants from "@/components/LeagueParticipants";
import { convertUrlParamToNumber } from "@/utils";
import redirectInternal from "../../../utils/redirects";

const Container = styled.div`
  margin: 0 0.2rem;
`;

const Title = styled.h1`
  color: purple;
`;

const Subtitle = styled.h2`
  color: green;
`;

interface Props {
  leagueId: number;
  name: string;
  applicants: User[];
  participants: User[];
}

const LeaguePage = ({ leagueId, name, applicants, participants }: Props) => (
  <Container>
    <Header />
    <Title>{name}</Title>
    <Subtitle>Requests</Subtitle>
    <LeagueApplicants applicants={applicants} leagueId={leagueId} />
    <LeagueParticipants participants={participants} />
  </Container>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) {
    context.res.writeHead(302, { Location: "/" });
    context.res.end();
  }

  // Get the logged in user
  const user = await prisma.user.findUnique({
    where: {
      email: session?.user.email || "",
    },
  });

  if (!user) return redirectInternal("/leagues");

  // Get the leagueId from the URL
  const leagueId = convertUrlParamToNumber(context.params?.leagueId);

  if (!leagueId || leagueId <= 0) return redirectInternal("/leagues");

  // Get the league details
  const league = await prisma.league.findUnique({
    where: {
      id: leagueId,
    },
    include: {
      users: true,
      applicants: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!league) return redirectInternal("/leagues");

  if (league.administratorId !== user.id) {
    return redirectInternal(`/league/${leagueId}`);
  }

  const applicants = league.applicants
    .filter((applicant) => applicant.status === "applied")
    .map((applicant) => ({
      id: applicant.userId,
      status: applicant.status,
      username: applicant.user.username,
    }));

  const participants = league.users.map((participant) => ({
    id: participant.id,
    username: participant.username || "",
  }));

  return {
    props: {
      leagueId: league.id,
      name: league.name,
      applicants,
      participants,
    },
  };
};

export default LeaguePage;
