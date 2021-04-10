import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import React from "react";

import prisma from "prisma/client";
import { League } from "@prisma/client";
import { convertUrlParamToNumber } from "@/utils";
import { WeeklyScores } from "@/types";
import LeagueSummary from "@/containers/LeagueSummary";
import redirectInternal from "../../../utils/redirects";

interface Props {
  leagueName: League["name"];
  weeklyScores: WeeklyScores;
}

const LeagueSummaryPage = ({ leagueName, weeklyScores }: Props) => (
  <LeagueSummary leagueName={leagueName} weeklyScores={weeklyScores} />
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) {
    context.res.writeHead(302, { Location: "/" });
    context.res.end();
  }

  // Get the logged in user
  const loggedInUser = await prisma.user.findUnique({
    where: {
      email: session?.user.email || "",
    },
  });
  if (!loggedInUser) return redirectInternal("/leagues");

  // Get the leagueId from the URL
  const leagueId = convertUrlParamToNumber(context.params?.leagueId);
  if (!leagueId || leagueId <= 0) return redirectInternal("/leagues");

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
              fixtures: {
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
  const gameweeks = league.users[0].predictions
    .reduce((acc, cur) => {
      if (!acc.includes(cur.fixtures.gameweek)) {
        acc.push(cur.fixtures.gameweek);
      }
      return acc;
    }, [])
    .sort((a, b) => a - b);

  const weeklyScores = gameweeks.map((gameweek) => ({
    week: gameweek,
    users: league.users.map((user) => ({
      id: user.id,
      username: user.username,
      score: user.predictions
        .filter((x) => x.fixtures.gameweek === gameweek)
        .reduce((acc, cur) => acc + (cur.score || 0), 0),
    })),
  }));
  console.log("weeklyScores", JSON.stringify(weeklyScores, null, 2));

  return {
    props: {
      leagueName: league.name,
      weeklyScores,
    },
  };
};

export default LeagueSummaryPage;
