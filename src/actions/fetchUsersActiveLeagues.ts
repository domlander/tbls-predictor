"use server";

import prisma from "prisma/client";
import UserLeague from "src/types/UserLeague";
import getWeeklyPoints from "../../utils/getWeeklyPoints";
import calculateWeeksUntilStart from "../../utils/calculateWeeksUntilStart";
import calculateWeeksToGo from "../../utils/calculateWeeksToGo";
import calculateUsersLeaguePosition from "../../utils/calculateUsersLeaguePosition";
import { calculateCurrentGameweek } from "utils/calculateCurrentGameweek";

const fetchUsersActiveLeagues = async (
  userId: string
): Promise<UserLeague[]> => {
  const fixtures = await prisma.fixture.findMany();
  const currentGameweek = calculateCurrentGameweek(fixtures);

  // Get all users leagues and all users that belong to those leagues, including their predictions
  const userLeagues = await prisma.user.findUnique({
    include: {
      leagues: {
        include: {
          users: {
            select: {
              id: true,
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
              },
            },
          },
        },
      },
    },
    where: {
      id: userId,
    },
  });

  if (!userLeagues?.leagues.length) {
    return [];
  }

  return (
    userLeagues.leagues
      // .filter(({ gameweekEnd }) => gameweekEnd >= currentGameweek)
      .sort((a, b) => a.gameweekStart - b.gameweekStart)
      .map((league) => {
        const users = league.users.map((user) => ({
          ...user,
          totalPoints: getWeeklyPoints(
            fixtures,
            user.predictions || [],
            league.gameweekStart,
            league.gameweekEnd
          ).reduce((acc, cur) => acc + (cur.points || 0), 0),
        }));

        return {
          leagueId: league.id,
          leagueName: league.name,
          weeksUntilStart: calculateWeeksUntilStart(
            currentGameweek,
            league.gameweekStart
          ),
          weeksToGo: calculateWeeksToGo(currentGameweek, league.gameweekEnd),
          position: calculateUsersLeaguePosition(users, userId),
          numParticipants: league.users.length,
        };
      })
  );
};

export default fetchUsersActiveLeagues;
