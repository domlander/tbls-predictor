import prisma from "prisma/client";
import { redirect } from "next/navigation";

import LeagueContainer from "src/containers/League";
import { convertUrlParamToNumber } from "utils/convertUrlParamToNumber";
import redirectInternal from "utils/redirects";
import { calculateCurrentGameweek } from "utils/calculateCurrentGameweek";
import getWeeklyPoints from "utils/getWeeklyPoints";

// TODO: investigate how caching with revalidate works in serverless environments.
// Caching results for 30 secs/longer with revalidate on data update would work better
// here, but I'm not convinced this works with serverless well
export const dynamic = "force-dynamic";

type Params = { leagueId: string };

const Page = async ({ params }: { params: Params }) => {
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
  if (!league) {
    return redirect("/leagues");
  }

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
    .map(({ id, username, totalPoints, weeklyPoints }) => ({
      id,
      username,
      totalPoints,
      weeklyPoints: [
        ...weeklyPoints.filter(
          ({ week }) =>
            week >= league.gameweekStart &&
            week <= Math.min(league.gameweekEnd, currentGameweek)
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

  return (
    <LeagueContainer
      id={leagueId}
      name={league.name}
      gameweekStart={league.gameweekStart}
      gameweekEnd={league.gameweekEnd}
      administratorId={league.administratorId}
      users={sortedUsers}
      fixtureWeeksAvailable={fixtureWeeksAvailable}
    />
  );
};

export default Page;
