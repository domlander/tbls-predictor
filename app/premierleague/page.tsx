import prisma from "prisma/client";
import PremierLeague from "src/containers/PremierLeague";
import { PremierLeagueTeam } from "src/types/PremierLeagueTeam";
import generatePremTable from "utils/createPremierLeagueTableFromFixtures";

export const Page = async () => {
  const fixtures = await prisma.fixture.findMany({
    select: {
      homeTeam: true,
      awayTeam: true,
      homeGoals: true,
      awayGoals: true,
    },
  });

  const premierLeagueTable: PremierLeagueTeam[] = generatePremTable(fixtures);

  return <PremierLeague teams={premierLeagueTable} />;
};
