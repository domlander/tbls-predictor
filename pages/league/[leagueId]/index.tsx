import { GetStaticProps, GetStaticPaths } from "next";
import prisma from "prisma/client";

import LeagueHome from "src/containers/League";
import User from "src/types/User";
import { convertUrlParamToNumber } from "utils/convertUrlParamToNumber";
import redirectInternal from "utils/redirects";
import { calculateCurrentGameweek } from "utils/calculateCurrentGameweek";
import getWeeklyPoints from "utils/getWeeklyPoints";

interface Props {
  id: number;
  name: string;
  gameweekStart: number;
  gameweekEnd: number;
  users: User[];
  administratorId: string;
  fixtureWeeksAvailable: number[];
}

const LeaguePage = ({
  id,
  name,
  gameweekStart,
  gameweekEnd,
  administratorId,
  users,
  fixtureWeeksAvailable,
}: Props) => (
  <LeagueHome
    id={id}
    name={name}
    gameweekStart={gameweekStart}
    gameweekEnd={gameweekEnd}
    administratorId={administratorId}
    users={users}
    fixtureWeeksAvailable={fixtureWeeksAvailable}
  />
);

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const leagueId = convertUrlParamToNumber(params?.leagueId);
  if (!leagueId || leagueId <= 0) return redirectInternal("/leagues");

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
              homeGoals: true,
              awayGoals: true,
              bigBoyBonus: true,
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

  // TODO Show league not found message
  if (!league)
    return {
      props: {},
      redirect: {
        destination: "/leagues",
        permanent: false,
      },
    };

  const fixtures = await prisma.fixture.findMany({
    select: {
      id: true,
      homeGoals: true,
      awayGoals: true,
      gameweek: true,
      kickoff: true,
    },
  });

  const users = league.users.map((user) => {
    const predictions = user.predictions.filter(
      (prediction) =>
        prediction.fixture.gameweek >= league.gameweekStart &&
        prediction.fixture.gameweek <= league.gameweekEnd
    );

    /**
       The accumulator is an array of the form:
       [{ week: 1, points: 0 }, { week: 2, points: 0 }, ... , { week: n, points: 0 }]

       The callback function iterates through the fixtures, compares predictions against
       each fixture to obtain the points for that fixture, then adds the points to the 
       correct array index in the accumulator
     */
    const weeklyPoints = getWeeklyPoints(
      fixtures,
      predictions,
      league.gameweekStart,
      league.gameweekEnd
    );

    const totalPoints = weeklyPoints.reduce(
      (acc, cur) => acc + (cur.points || 0),
      0
    );

    return {
      ...user,
      weeklyPoints,
      totalPoints,
    };
  });

  const currentGameweek = calculateCurrentGameweek(fixtures);
  const sortedUsers = users
    .sort((a, b) => b.totalPoints - a.totalPoints || (b.id > a.id ? 1 : -1))
    .map((user) => ({
      ...user,
      weeklyPoints: [
        ...user.weeklyPoints.filter(
          (weeklyPoints) =>
            weeklyPoints.week >= league.gameweekStart &&
            weeklyPoints.week <= Math.min(league.gameweekEnd, currentGameweek)
        ),
      ].reverse(),
    }));

  const gameweeksPlayed =
    Math.min(currentGameweek, league.gameweekEnd) - league.gameweekStart + 1;

  const fixtureWeeksAvailable =
    gameweeksPlayed > 0
      ? [...Array(gameweeksPlayed).keys()]
          .map((x) => x + league.gameweekStart)
          .reverse()
      : null;

  return {
    props: {
      id: leagueId,
      name: league.name,
      gameweekStart: league.gameweekStart,
      gameweekEnd: league.gameweekEnd,
      users: sortedUsers,
      administratorId: league.administratorId,
      fixtureWeeksAvailable,
    },
    revalidate: 1,
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
