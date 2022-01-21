import React from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import prisma from "prisma/client";
import { initializeApollo } from "apollo/client";

import { LEAGUE_WEEK_QUERY } from "apollo/queries";
import { convertUrlParamToNumber } from "utils/convertUrlParamToNumber";
import redirectInternal from "utils/redirects";
import { League } from "src/types/League";
import { Fixture } from "src/types/Fixture";
import { User } from "src/types/User";
import LeagueWeek from "@/containers/LeagueWeek";

interface Props {
  leagueId: number;
  leagueName: string;
  weekId: number;
  users: User[];
  fixtures: Fixture[];
  firstGameweek: number;
  lastGameweek: number;
}

const LeagueWeekPage = ({
  leagueId,
  leagueName,
  weekId,
  users,
  fixtures,
  firstGameweek,
  lastGameweek,
}: Props) => (
  <LeagueWeek
    leagueId={leagueId}
    leagueName={leagueName}
    weekId={weekId}
    users={users}
    fixtures={fixtures}
    firstGameweek={firstGameweek}
    lastGameweek={lastGameweek}
  />
);

export const getStaticProps: GetStaticProps = async ({ params }) => {
  // Get the league ID from the URL
  const leagueId = convertUrlParamToNumber(params?.leagueId);
  if (!leagueId || leagueId <= 0) return redirectInternal("/leagues");

  // Get the week from the URL
  const weekId = convertUrlParamToNumber(params?.weekId);
  if (!weekId || weekId <= 0) return redirectInternal(`/league/${leagueId}`);

  const apolloClient = initializeApollo();
  const { data } = await apolloClient.query({
    query: LEAGUE_WEEK_QUERY,
    variables: { leagueId, weekId },
    errorPolicy: "ignore",
  });

  if (!data?.league || !data?.fixturesWithPredictions?.fixtures?.length) {
    return { notFound: true };
  }

  const fixtures = data.fixturesWithPredictions.fixtures || [];
  const { league } = data;

  return {
    props: {
      leagueId,
      leagueName: league.name,
      weekId,
      users: league.users,
      fixtures: JSON.parse(JSON.stringify(fixtures)),
      firstGameweek: league.gameweekStart,
      lastGameweek: league.gameweekEnd,
    },
    revalidate: 60,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const leagues: League[] = await prisma.league.findMany();
  const fixtures: Fixture[] = await prisma.fixture.findMany();

  const paths: any = [];
  leagues.forEach((league) => {
    const fixtureWeeksAvailable = fixtures
      .filter(
        (fixture) =>
          league.gameweekStart &&
          league.gameweekEnd &&
          fixture.gameweek <= league.gameweekEnd &&
          fixture.gameweek >= league.gameweekStart
      )
      .reduce((acc: number[], fixture) => {
        if (acc.indexOf(fixture.gameweek) === -1) {
          acc.push(fixture.gameweek);
        }
        return acc;
      }, []);

    paths.push(
      ...fixtureWeeksAvailable.map((week) => ({
        params: {
          leagueId: league.id.toString(),
          weekId: week.toString(),
        },
      }))
    );
  });

  return {
    paths,
    fallback: "blocking",
  };
};

export default LeagueWeekPage;
