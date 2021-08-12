import React from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import prisma from "prisma/client";

import { convertUrlParamToNumber } from "utils/convertUrlParamToNumber";
import redirectInternal from "utils/redirects";
import LeagueHome from "../../../src/containers/League";

interface Props {
  leagueId: number;
  isLeagueAdmin: boolean;
  fixtureWeeksAvailable: number[];
}

const LeaguePage = ({
  leagueId,
  isLeagueAdmin,
  fixtureWeeksAvailable,
}: Props) => (
  <LeagueHome
    leagueId={leagueId}
    isLeagueAdmin={isLeagueAdmin}
    fixtureWeeksAvailable={fixtureWeeksAvailable}
  />
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Get the leagueId from the URL
  const leagueId = convertUrlParamToNumber(context.params?.leagueId);
  if (!leagueId || leagueId <= 0) return redirectInternal("/leagues");

  const session = await getSession(context);
  if (!session?.user.id) {
    return {
      props: {},
      redirect: {
        destination: "/signIn",
        permanent: false,
      },
    };
  }

  const league = await prisma.league.findUnique({
    where: {
      id: leagueId,
    },
  });

  const fixtures = await prisma.fixture.findMany({});
  const fixtureWeeksAvailable = fixtures.reduce((acc: number[], fixture) => {
    if (acc.indexOf(fixture.gameweek) === -1) {
      acc.push(fixture.gameweek);
    }
    return acc;
  }, []);

  return {
    props: {
      leagueId,
      isLeagueAdmin: league?.administratorId === session.user.id,
      fixtureWeeksAvailable,
    },
  };
};

export default LeaguePage;
