import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import React from "react";

import prisma from "prisma/client";
import { League, User } from "@prisma/client";
import { convertUrlParamToNumber } from "@/utils";
import LeagueTable from "src/containers/LeagueTable";
import redirectInternal from "../../../utils/redirects";

interface Props {
  leagueName: League["name"];
  participants: User[];
}

const LeagueTablePage = ({ leagueName, participants }: Props) => (
  <LeagueTable leagueName={leagueName} participants={participants} />
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
    },
  });
  if (!league) return redirectInternal("/leagues");

  const participants = league.users.map((participant) => ({
    id: participant.id,
    username: participant.username || "",
  }));

  // const weeklyScores = [];

  return {
    props: {
      leagueName: league.name,
      participants,
      // weeklyScores,
    },
  };
};

export default LeagueTablePage;
