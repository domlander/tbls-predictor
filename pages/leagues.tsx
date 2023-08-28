import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Leagues from "src/containers/Leagues";
import redirectInternal from "utils/redirects";
import UserLeague from "src/types/UserLeague";
import prisma from "prisma/client";
import calculateWeeksUntilStart from "utils/calculateWeeksUntilStart";
import calculateWeeksToGo from "utils/calculateWeeksToGo";
import calculateUsersLeaguePosition from "utils/calculateUsersLeaguePosition";
import getWeeklyPoints from "utils/getWeeklyPoints";
import { calculateCurrentGameweek } from "utils/calculateCurrentGameweek";

type Props = {
  activeLeagues: UserLeague[];
};

const LeaguesPage = ({ activeLeagues }: Props) => {
  return <Leagues activeLeagues={activeLeagues} />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const userId = session?.user?.id;
  if (!userId) {
    return redirectInternal("/signIn");
  }

  const fixtures = await prisma.fixture.findMany({
    select: {
      id: true,
      gameweek: true,
      kickoff: true,
      homeTeam: true,
      awayTeam: true,
      homeGoals: true,
      awayGoals: true,
    },
  });

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

  const activeLeagues = userLeagues?.leagues
    .filter(({ gameweekEnd }) => gameweekEnd >= currentGameweek)
    .sort((a, b) => a.gameweekStart - b.gameweekStart)
    .map((league) => {
      const users = league.users.map((u) => ({
        ...u,
        totalPoints: getWeeklyPoints(
          fixtures,
          u.predictions,
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
    });

  return {
    props: {
      activeLeagues,
    },
  };
};

export default LeaguesPage;
