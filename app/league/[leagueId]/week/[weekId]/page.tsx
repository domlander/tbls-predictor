import prisma from "prisma/client";
import { redirect } from "next/navigation";

import LeagueWeek from "src/containers/LeagueWeek";
import Fixture from "src/types/Fixture";
import UserPoints from "src/types/UserPoints";
import { convertUrlParamToNumber } from "utils/convertUrlParamToNumber";
import calculatePredictionScore from "utils/calculatePredictionScore";
import getWeekPoints from "utils/getWeekPoints";
import { getMissingPredictions } from "utils/getMissingPredictions";

// TODO: investigate how caching with revalidate works in serverless environments.
// Caching results for 30 secs/longer with revalidate on data update would work better
// here, but I'm not convinced this works with serverless well
export const dynamic = "force-dynamic";

type Params = { leagueId: string; weekId: string };

const Page = async ({ params }: { params: Params }) => {
  // Get the league ID from the URL
  const leagueId = convertUrlParamToNumber(params?.leagueId);
  if (!leagueId || leagueId <= 0) return redirect("/leagues");

  // Get the week from the URL
  const weekId = convertUrlParamToNumber(params?.weekId);
  if (!weekId || weekId <= 0) return redirect(`/league/${leagueId}`);

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
                  homeGoals: true,
                  awayGoals: true,
                },
              },
            },
            where: {
              fixture: {
                gameweek: weekId,
              },
            },
          },
        },
      },
    },
  });
  if (!league) {
    return redirect(`/league/${leagueId}`);
  }

  const fixtures = await prisma.fixture.findMany({
    where: {
      gameweek: weekId,
    },
  });

  const users = league.users
    .map((user) => {
      const predictions = [
        ...user.predictions,
        ...getMissingPredictions(user.predictions, fixtures),
      ];

      const weekPoints = getWeekPoints(fixtures, predictions);

      return {
        ...user,
        predictions,
        weekPoints,
      };
    })
    .sort((a, b) => {
      return b.weekPoints - a.weekPoints || (b.id > a.id ? 1 : -1);
    });

  const fixturesWithPredictions: Fixture[] = fixtures.map((fixture) => ({
    ...fixture,
    predictions: [],
  }));

  fixturesWithPredictions.forEach((fixture) => {
    users.forEach((user) => {
      const userPrediction = user.predictions.find(
        ({ fixtureId }) => fixtureId === fixture.id
      );

      const prediction = {
        user: {
          id: user.id,
        },
        fixtureId: fixture.id,
      };

      if (userPrediction) {
        const score = calculatePredictionScore(
          [
            userPrediction.homeGoals ?? 0,
            userPrediction.awayGoals ?? 0,
            userPrediction.bigBoyBonus ?? false,
          ],
          [userPrediction.fixture.homeGoals, userPrediction.fixture.awayGoals]
        );

        fixture.predictions?.push({
          ...prediction,
          homeGoals: userPrediction.homeGoals,
          awayGoals: userPrediction.awayGoals,
          bigBoyBonus: userPrediction.bigBoyBonus,
          score,
        });
      } else {
        fixture.predictions?.push({
          ...prediction,
          homeGoals: null,
          awayGoals: null,
          bigBoyBonus: false,
          score: null,
        });
      }
    });
  });

  const usersGameweekPoints: UserPoints[] = users.map(
    ({ id, username, weekPoints }) => ({
      id,
      username: username || "unknown",
      points: weekPoints || 0,
    })
  );

  return (
    <LeagueWeek
      leagueId={leagueId}
      leagueName={league.name}
      weekId={weekId}
      usersGameweekPoints={usersGameweekPoints}
      fixtures={JSON.parse(JSON.stringify(fixturesWithPredictions))}
      firstGameweek={league.gameweekStart}
      lastGameweek={league.gameweekEnd}
    />
  );
};

export default Page;
