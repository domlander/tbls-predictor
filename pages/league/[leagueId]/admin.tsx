import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import React from "react";

import prisma from "prisma/client";
import { User } from "@prisma/client";
import { convertUrlParamToNumber } from "@/utils";
import LeagueAdmin from "src/containers/LeagueAdmin";
import redirectInternal from "../../../utils/redirects";

interface Props {
  leagueId: number;
  name: string;
  applicants: User[];
  participants: User[];
}

const LeagueAdminPage = ({
  leagueId,
  name,
  applicants,
  participants,
}: Props) => (
  <LeagueAdmin
    leagueId={leagueId}
    name={name}
    applicants={applicants}
    participants={participants}
  />
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return {
      props: {},
      redirect: {
        destination: "/signIn",
        permanent: false,
      },
    };
  }

  if (!session?.user.email) return redirectInternal("/");

  // Get the logged in user
  const user = await prisma.user.findUnique({
    where: {
      email: session?.user.email,
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

export default LeagueAdminPage;
