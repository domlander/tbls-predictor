import { GetStaticProps } from "next";
import prisma from "prisma/client";
import PremierLeague from "src/containers/PremierLeague";
import { PremierLeagueTeam } from "src/types/PremierLeagueTeam";
import generatePremTable from "utils/createPremierLeagueTableFromFixtures";

interface Props {
  premierLeagueTable: PremierLeagueTeam[];
}

const PremierLeaguePage = ({ premierLeagueTable }: Props) => {
  return <PremierLeague teams={premierLeagueTable} />;
};

export const getStaticProps: GetStaticProps = async () => {
  const fixtures = await prisma.fixture.findMany({
    select: {
      homeTeam: true,
      awayTeam: true,
      homeGoals: true,
      awayGoals: true,
    },
  });

  const premierLeagueTable: PremierLeagueTeam[] = generatePremTable(fixtures);

  return {
    props: {
      premierLeagueTable,
    },
    revalidate: 1, // Revalidate at quickly as allowed
  };
};

export default PremierLeaguePage;
