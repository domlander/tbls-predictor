import { GetServerSideProps } from "next";
import UsersPredictedTable from "src/containers/UsersPredictedTable";
import redirectInternal from "utils/redirects";
import prisma from "prisma/client";
import { PremierLeagueTeam } from "src/types/PremierLeagueTeam";
import generatePremTable from "utils/createPremierLeagueTableFromFixtures";

type Props = {
  username: string;
  table: PremierLeagueTeam[];
  predictedTable: PremierLeagueTeam[];
};

const Page = ({ username, table, predictedTable }: Props) => {
  return (
    <UsersPredictedTable
      username={username}
      table={table}
      predictedTable={predictedTable}
    />
  );
};

/**
 * Get all fixtures and users predictions
 *
 * Create an array of "true" results:
 *  - if prediction: the prediction
 *  - no prediction: the result
 *
 * Create a league table from those "true" results
 */
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const userId = params?.userId;
  if (typeof userId !== "string") return redirectInternal("");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      username: true,
    },
  });
  if (!user) return redirectInternal("");
  const fixtures = await prisma.fixture.findMany({
    select: {
      id: true,
      homeTeam: true,
      awayTeam: true,
      homeGoals: true,
      awayGoals: true,
    },
  });

  const premierLeagueTable: PremierLeagueTeam[] = generatePremTable(fixtures);

  // Get all of this user's predictions
  const predictions = await prisma.prediction.findMany({
    where: {
      userId,
    },
    include: {
      user: {
        select: {
          id: true,
        },
      },
      fixture: {
        select: {
          homeTeam: true,
          awayTeam: true,
          homeGoals: true,
          awayGoals: true,
        },
      },
    },
  });

  // Filter out future predictions
  const predictionsWithResult = predictions.filter(
    (pred) => pred.fixture.homeGoals !== null && pred.fixture.awayGoals !== null
  );

  // Use the prediction as the result. If no prediction, use the actual result of the match.
  const trueResults = fixtures.map((fixture) => {
    const prediction = predictionsWithResult.find(
      (p) => p.fixtureId === fixture.id
    );
    if (!prediction) {
      return fixture;
    }

    return {
      ...fixture,
      homeGoals: prediction.homeGoals,
      awayGoals: prediction.awayGoals,
    };
  });

  const table = generatePremTable(fixtures);

  const predictedTable: PremierLeagueTeam[] = generatePremTable(
    trueResults
  ).map((team) => ({
    ...team,
    predictedPoints: team.points,
    points: premierLeagueTable.find((t) => t.team === team.team)?.points || 0,
  }));

  return {
    props: {
      username: user.username,
      table,
      predictedTable,
    },
  };
};

export default Page;
