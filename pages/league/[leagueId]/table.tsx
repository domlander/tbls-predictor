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

  const gameweeks = league.users[0].predictions
    .reduce((acc, cur) => {
      if (!acc.includes(cur.fixtures.gameweek)) {
        acc.push(cur.fixtures.gameweek);
      }
      return acc;
    }, [])
    .sort((a, b) => a - b);

  console.log("league", JSON.stringify(league, null, 2));

  const usersScores = league.users.map((user) => ({
    id: user.id,
    username: user.username,
    scores: user.predictions.reduce((weeklyScores, predo) => {
      const { gameweek } = predo.fixtures;
      weeklyScores[gameweek] = (weeklyScores[gameweek] || 0) + predo.score;
      return weeklyScores;
    }, {}),
  }));
  console.log("usersScores", JSON.stringify(usersScores, null, 2));

  const weeklyScores = gameweeks.map((gameweek) => ({
    week: gameweek,
    users: usersScores.map(({ id, username, scores }) => ({
      id,
      username,
      score: scores[gameweek],
    })),
    usersAgain: league.users.map((user) => ({
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
      participants: [],
      weeklyScores,
    },
  };
};

export default LeagueTablePage;

/*
      weeklyScores: [
        {
          week: 1,
          users: [
            { username: "dom 722", score: 2 }
            { username: "dom 723", score: 12 }
          ]
        },
        {
          week: 2,
          users: [
            { username: "dom 722", score: 4 }
            { username: "dom 723", score: 0 }
          ]
        },
      ]

      weeklyScores [
        {
          "week": 1,
          "users": [
            {
              "id": 1,
              "username": "domtest722",
              "score": 2
            },
            {
              "id": 2,
              "username": "dom 723",
              "score": 12
            }
          ]
        },
        {
          "week": 2,
          "users": [
            {
              "id": 1,
              "username": "domtest722",
              "score": 0
            },
            {
              "id": 2,
              "username": "dom 723",
              "score": 0
            }
          ]
        }
      ]

  */
