import React from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { Fixture, League } from "@prisma/client";

import prisma from "prisma/client";
import { initializeApollo } from "apollo/client";
import { LEAGUE_WEEK } from "apollo/queries";
import LeagueWeek from "@/containers/LeagueWeek";
import { convertUrlParamToNumber } from "utils/convertUrlParamToNumber";
import redirectInternal from "utils/redirects";
import { FixtureWithUsersPredictions, UserTotalPointsWeek } from "@/types";

interface Props {
  leagueId: number;
  leagueName: string;
  weekId: number;
  users: UserTotalPointsWeek[];
  fixtures: FixtureWithUsersPredictions[];
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
  const {
    data: {
      leagueWeek: { leagueName, users, fixtures, firstGameweek, lastGameweek },
    },
  } = await apolloClient.query({
    query: LEAGUE_WEEK,
    variables: { input: { leagueId, weekId } },
  });

  return {
    props: {
      leagueId,
      leagueName,
      weekId,
      users,
      fixtures,
      firstGameweek,
      lastGameweek,
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
    fallback: false,
  };
};

export default LeagueWeekPage;
