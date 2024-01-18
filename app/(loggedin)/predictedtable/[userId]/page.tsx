import { redirect } from "next/navigation";
import prisma from "prisma/client";
import PremierLeague from "src/containers/PremierLeague";
import { PremierLeagueTeam } from "src/types/PremierLeagueTeam";
import { appendTeamNameWithPositionDiff } from "utils/appendTeamNameWithPositionDiff";
import generatePremTable from "utils/createPremierLeagueTableFromFixtures";

export const dynamic = "force-dynamic";

/**
 * Provides a league table to show the user what the league table would
 * look like if their own predictions were the true results.
 */
const Page = async ({ params }: { params: { userId: string } }) => {
  const userId = params?.userId;
  if (typeof userId !== "string") return redirect("/");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      username: true,
    },
  });
  if (!user?.username) return redirect("/");

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

  // Generate a league table from the predicted results
  const table = generatePremTable(fixtures);

  const predictedTable: PremierLeagueTeam[] = generatePremTable(
    trueResults
  ).map((team) => ({
    ...team,
    predictedPoints: team.points,
    points:
      premierLeagueTable.find(({ name }) => name === team.name)?.points || 0,
  }));

  // Adjust the name of the team to include position difference
  const predictedPositions = appendTeamNameWithPositionDiff(
    predictedTable,
    table
  );

  return (
    <PremierLeague
      teams={predictedPositions}
      heading={`${user.username}'s predicted league`}
      loading={false}
      isPredictedLeague
    />
  );
};

export default Page;
