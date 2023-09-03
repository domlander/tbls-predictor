import { GetStaticPaths, GetStaticProps } from "next";
import prisma from "prisma/client";

import { convertUrlParamToNumber } from "utils/convertUrlParamToNumber";
import redirectInternal from "utils/redirects";
import League from "src/types/League";
import Fixture from "src/types/Fixture";
import User from "src/types/User";
import LeagueWeek from "src/containers/LeagueWeek";
import calculatePredictionScore from "utils/calculatePredictionScore";
import Prediction from "src/types/Prediction";

type MissingPrediction = Pick<
  Prediction,
  "fixtureId" | "homeGoals" | "awayGoals" | "bigBoyBonus"
> & {
  fixture: Pick<Fixture, "gameweek" | "homeGoals" | "awayGoals">;
};

interface Props {
  leagueId: number;
  leagueName: string;
  weekId: number;
  users: User[];
  fixtures: Fixture[];
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
}: Props) => {
  return (
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
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  // Get the league ID from the URL
  const leagueId = convertUrlParamToNumber(params?.leagueId);
  if (!leagueId || leagueId <= 0) return redirectInternal("/leagues");

  // Get the week from the URL
  const weekId = convertUrlParamToNumber(params?.weekId);
  if (!weekId || weekId <= 0) return redirectInternal(`/league/${leagueId}`);

  /**
   * TODO
   * Change from:
   * - Fetch users, their predictions and the fixtures those predictions belong to
   * To:
   * - Fetch fixtures, fetch users predictions, then match up.
   */
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
    return redirectInternal(`/league/${leagueId}`);
  }

  const fixtures = await prisma.fixture.findMany({
    where: {
      gameweek: weekId,
    },
  });

  // Add missed predictions as 0-0
  const usersWithAppendedPredictions = league.users.map((user) => {
    const missingPredictions: MissingPrediction[] = [];
    fixtures.forEach((fixture) => {
      const isMissingPrediction =
        user.predictions.findIndex((p) => p.fixtureId === fixture.id) === -1;

      if (isMissingPrediction) {
        missingPredictions.push({
          fixtureId: fixture.id,
          homeGoals: 0,
          awayGoals: 0,
          bigBoyBonus: false,
          fixture: {
            gameweek: weekId,
            homeGoals: fixture.homeGoals,
            awayGoals: fixture.awayGoals,
          },
        });
      }
    });

    return {
      ...user,
      predictions: [...user.predictions, ...missingPredictions],
    };
  });

  // Sort users
  const users = usersWithAppendedPredictions.sort((a, b) => {
    const totalPointsA = a.predictions.reduce((acc, cur) => {
      const score = calculatePredictionScore(
        [cur.homeGoals ?? 0, cur.awayGoals ?? 0, cur.bigBoyBonus ?? false],
        [cur.fixture.homeGoals, cur.fixture.awayGoals]
      );

      return acc + score;
    }, 0);

    const totalPointsB = b.predictions.reduce((acc, cur) => {
      const score = calculatePredictionScore(
        [cur.homeGoals ?? 0, cur.awayGoals ?? 0, cur.bigBoyBonus ?? false],
        [cur.fixture.homeGoals, cur.fixture.awayGoals]
      );

      return acc + score;
    }, 0);

    return totalPointsB - totalPointsA || (b.id > a.id ? 1 : -1);
  });

  const fixturesWithPredictions: Fixture[] = fixtures.map((fixture) => ({
    ...fixture,
    predictions: [],
  }));

  fixturesWithPredictions.forEach((fixture) => {
    users.forEach((user) => {
      const userPrediction = user.predictions.find(
        (p) => p.fixtureId === fixture.id
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

  return {
    props: {
      key: `${leagueId}-${weekId}`,
      leagueId,
      leagueName: league.name,
      weekId,
      users: league.users,
      fixtures: JSON.parse(JSON.stringify(fixturesWithPredictions)),
      firstGameweek: league.gameweekStart,
      lastGameweek: league.gameweekEnd,
    },
    revalidate: 1,
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
          league.gameweekStart &&
          league.gameweekEnd &&
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
    fallback: "blocking",
  };
};

export default LeagueWeekPage;
