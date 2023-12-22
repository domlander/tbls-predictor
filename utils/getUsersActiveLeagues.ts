import prisma from "prisma/client";
import Fixture from "src/types/Fixture";
import UserLeague from "src/types/UserLeague";
import getWeeklyPoints from "./getWeeklyPoints";
import calculateWeeksUntilStart from "./calculateWeeksUntilStart";
import calculateWeeksToGo from "./calculateWeeksToGo";
import calculateUsersLeaguePosition from "./calculateUsersLeaguePosition";

const getUsersActiveLeagues = async (
  userId: string,
  fixtures: Pick<Fixture, "id" | "gameweek" | "homeGoals" | "awayGoals">[],
  currentGameweek: number
): Promise<UserLeague[]> => {
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

export default getUsersActiveLeagues;
