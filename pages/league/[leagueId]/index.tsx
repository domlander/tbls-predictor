import React from "react";
import { GetStaticProps, GetStaticPaths } from "next";
import prisma from "prisma/client";

import { initializeApollo } from "apollo/client";
import LeagueHome from "src/containers/League";
import { ALL_FIXTURES_QUERY, LEAGUE_QUERY } from "apollo/queries";
import { convertUrlParamToNumber } from "utils/convertUrlParamToNumber";
import redirectInternal from "utils/redirects";
import User from "src/types/User";

interface Props {
  id: number;
  name: string;
  gameweekStart: number;
  users: User[];
  administratorId: string;
  fixtureWeeksAvailable: number[];
}

const LeaguePage = ({
  id,
  name,
  gameweekStart,
  administratorId,
  users,
  fixtureWeeksAvailable,
}: Props) => (
  <LeagueHome
    id={id}
    name={name}
    gameweekStart={gameweekStart}
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
  const { data } = await apolloClient.query({
    query: LEAGUE_QUERY,
    variables: { leagueId },
    errorPolicy: "ignore",
  });
  if (!data) return { notFound: true };

  const {
    league,
    league: { gameweekStart, gameweekEnd, users },
  } = data;

  const {
    data: {
      allFixtures: { currentGameweek },
    },
  }: {
    data: { allFixtures: { currentGameweek: number } };
  } = await apolloClient.query({
    query: ALL_FIXTURES_QUERY,
  });

  const gameweeksPlayed =
    Math.min(currentGameweek, gameweekEnd) - gameweekStart + 1;

  const fixtureWeeksAvailable =
    gameweeksPlayed > 0
      ? [...Array(gameweeksPlayed).keys()]
          .map((x) => x + gameweekStart)
          .reverse()
      : null;

  return {
    props: {
      id: leagueId,
      name: league.name,
      gameweekStart,
      users,
      administratorId: league.administratorId,
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
    fallback: "blocking",
  };
};

export default LeaguePage;
