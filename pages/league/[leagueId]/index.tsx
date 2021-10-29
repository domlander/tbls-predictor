import React from "react";
import { GetStaticProps, GetStaticPaths } from "next";
import { LEAGUE_DETAILS } from "apollo/queries";
import prisma from "prisma/client";
import { convertUrlParamToNumber } from "utils/convertUrlParamToNumber";
import redirectInternal from "utils/redirects";
import { UserTotalPoints, WeeklyPoints } from "@/types";
import LeagueHome from "../../../src/containers/League";
import { initializeApollo } from "../../../apollo/client";

interface Props {
  id: number;
  name: string;
  administratorId: number;
  users: UserTotalPoints[];
  pointsByWeek: WeeklyPoints[];
  fixtureWeeksAvailable: number[];
}

const LeaguePage = ({
  id,
  name,
  administratorId,
  users,
  pointsByWeek,
  fixtureWeeksAvailable,
}: Props) => (
  <LeagueHome
    id={id}
    name={name}
    administratorId={administratorId}
    users={users}
    pointsByWeek={pointsByWeek}
    fixtureWeeksAvailable={fixtureWeeksAvailable}
  />
);

export const getStaticProps: GetStaticProps = async ({ params }) => {
  // Get the leagueId from the URL
  const leagueId = convertUrlParamToNumber(params?.leagueId);
  if (!leagueId || leagueId <= 0) return redirectInternal("/leagues");

  const fixtures = await prisma.fixture.findMany();
  const fixtureWeeksAvailable = fixtures.reduce((acc: number[], fixture) => {
    if (acc.indexOf(fixture.gameweek) === -1) {
      acc.push(fixture.gameweek);
    }
    return acc;
  }, []);

  const apolloClient = initializeApollo();
  const {
    data: {
      leagueDetails: { leagueName, administratorId, users, pointsByWeek },
    },
  } = await apolloClient.query({
    query: LEAGUE_DETAILS,
    variables: { input: { leagueId } },
  });

  return {
    props: {
      id: leagueId,
      name: leagueName,
      administratorId,
      users,
      pointsByWeek,
      fixtureWeeksAvailable,
    },
    revalidate: 60,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const leagues = await prisma.league.findMany();
  const paths = leagues.map((x) => ({
    params: { leagueId: x.id.toString() },
  }));

  return {
    paths,
    fallback: false,
  };
};

export default LeaguePage;
