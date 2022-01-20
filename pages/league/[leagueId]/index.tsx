import React from "react";
import { GetStaticProps, GetStaticPaths } from "next";
import prisma from "prisma/client";

import { initializeApollo } from "apollo/client";
import { ALL_FIXTURES_QUERY, LEAGUE_QUERY } from "apollo/queries";
import { calculateCurrentGameweek } from "utils/calculateCurrentGameweek";
import { convertUrlParamToNumber } from "utils/convertUrlParamToNumber";
import redirectInternal from "utils/redirects";
import { User, WeeklyPoints } from "src/types/NewTypes";
import LeagueHome from "src/containers/League";

interface Props {
  id: number;
  name: string;
  administratorId: number;
  users: User[];
  fixtureWeeksAvailable: number[];
}

const LeaguePage = ({
  id,
  name,
  administratorId,
  users,
  fixtureWeeksAvailable,
}: Props) => (
  <LeagueHome
    id={id}
    name={name}
    administratorId={administratorId}
    users={users}
    fixtureWeeksAvailable={fixtureWeeksAvailable}
  />
);

export const getStaticProps: GetStaticProps = async ({ params }) => {
  // Get the leagueId from the URL
  const leagueId = convertUrlParamToNumber(params?.leagueId);
  if (!leagueId || leagueId <= 0) return redirectInternal("/leagues");

  const apolloClient = initializeApollo();
  const {
    data: {
      league: { name, gameweekStart, gameweekEnd, administratorId, users },
    },
  } = await apolloClient.query({
    query: LEAGUE_QUERY,
    variables: { leagueId },
  });

  const {
    data: { allFixtures },
  } = await apolloClient.query({
    query: ALL_FIXTURES_QUERY,
  });
  const currentGameweek = calculateCurrentGameweek(allFixtures);

  const fixtureWeeksAvailable = [
    ...Array(Math.min(currentGameweek, gameweekEnd) - gameweekStart + 1).keys(),
  ]
    .map((x) => x + gameweekStart)
    .reverse();

  const sortedUsers = [...users]
    .sort(
      (a, b) => b.totalPoints - a.totalPoints || parseInt(a.id) - parseInt(b.id)
    )
    .map((user) => ({
      ...user,
      weeklyPoints: [
        ...user.weeklyPoints.filter(
          (weeklyPoints: WeeklyPoints) =>
            weeklyPoints.week >= gameweekStart &&
            weeklyPoints.week <= Math.min(currentGameweek, gameweekEnd)
        ),
      ].reverse(),
    }));

  return {
    props: {
      id: leagueId,
      name,
      users: sortedUsers,
      administratorId,
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
