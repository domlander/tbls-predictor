import React from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";

import prisma from "prisma/client";
import { League } from "@prisma/client";
import { convertUrlParamToNumber } from "@/utils";
import { WeeklyScores } from "@/types";
import LeagueHome from "@/containers/League";
import redirectInternal from "utils/redirects";

interface Props {
  leagueName: League["name"];
  weeklyScores: WeeklyScores[];
}

const LeaguePage = ({ leagueName, weeklyScores }: Props) => (
  <LeagueHome leagueName={leagueName} weeklyScores={weeklyScores} />
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
  if (!session?.user.id) return redirectInternal("/");

  // Get the logged in user
  const loggedInUser = await prisma.user.findUnique({
    where: {
      id: session.user.id as number,
    },
    include: {
      leagues: true,
    },
  });
  if (!loggedInUser) return redirectInternal("/leagues");

  // Get the leagueId from the URL
  const leagueId = convertUrlParamToNumber(context.params?.leagueId);
  if (!leagueId || leagueId <= 0) return redirectInternal("/leagues");

  // If the user is not a member of this league, redirect them to leagues
  if (!loggedInUser.leagues.some((league) => league.id === leagueId))
    return redirectInternal("/leagues");

  // Get the league details
  const league = await prisma.league.findUnique({
    where: {
      id: leagueId,
    },
    include: {
      users: {
        select: {
          id: true,
          username: true,
          predictions: {
            select: {
              fixtureId: true,
              score: true,
              fixture: {
                select: {
                  gameweek: true,
                },
              },
            },
          },
        },
      },
    },
  });
  if (!league) return redirectInternal("/leagues");

  // Find all the gameweeks that have been played or are in progress
  const gameweeks: number[] = league.users[0].predictions
    .reduce((acc: number[], cur) => {
      if (!acc.includes(cur.fixture.gameweek)) {
        acc.push(cur.fixture.gameweek);
      }
      return acc;
    }, [])
    .sort((a, b) => a - b);

  const weeklyScores: WeeklyScores[] = gameweeks.map((gameweek) => ({
    week: gameweek,
    users: league.users.map((user) => ({
      id: user.id,
      username: user.username,
      score: user.predictions
        .filter((x) => x.fixture.gameweek === gameweek)
        .reduce((acc, cur) => acc + (cur.score || 0), 0),
    })),
  }));

  return {
    props: {
      leagueName: league.name,
      weeklyScores,
    },
  };
};

export default LeaguePage;
