import { GetStaticPaths, GetStaticProps } from "next";

import prisma from "prisma/client";
import { convertUrlParamToNumber } from "utils/convertUrlParamToNumber";
import redirectInternal from "utils/redirects";
import sortFixtures from "utils/sortFixtures";
import Fixture from "src/types/Fixture";
import Predictions from "src/containers/Predictions";
import TeamFixtures from "src/types/TeamFixtures";
import generateRecentFixturesByTeam from "utils/generateRecentFixturesByTeam";
import { calculateCurrentGameweek } from "utils/calculateCurrentGameweek";

interface Props {
  fixtures: Fixture[];
  weekId: number;
  recentFixturesByTeam: TeamFixtures[];
  firstGameweek: number;
  lastGameweek: number;
}

const PredictionsPage = ({
  fixtures,
  weekId,
  recentFixturesByTeam,
  firstGameweek,
  lastGameweek,
}: Props) => (
  <>
    <Predictions
      fixtures={fixtures}
      weekId={weekId}
      recentFixturesByTeam={recentFixturesByTeam}
      firstGameweek={firstGameweek}
      lastGameweek={lastGameweek}
    />
  </>
);

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const weekId = convertUrlParamToNumber(params?.weekId);
  if (!weekId || weekId <= 0) return redirectInternal("/");

  const fixtures: Fixture[] = await prisma.fixture.findMany();

  const firstGameweek = fixtures.reduce(
    (acc, fixture) => (fixture.gameweek < acc ? fixture.gameweek : acc),
    fixtures[0].gameweek
  );
  const lastGameweek = fixtures.reduce(
    (acc, fixture) => (fixture.gameweek > acc ? fixture.gameweek : acc),
    fixtures[0].gameweek
  );

  const sortedFixtures = sortFixtures(
    fixtures.filter((fixture) => fixture.gameweek === weekId)
  );

  const currentGameweek = calculateCurrentGameweek(fixtures);
  const recentFixturesByTeam = generateRecentFixturesByTeam(
    fixtures,
    currentGameweek
  );

  return {
    props: {
      fixtures: JSON.parse(JSON.stringify(sortedFixtures)),
      weekId,
      recentFixturesByTeam: JSON.parse(JSON.stringify(recentFixturesByTeam)),
      firstGameweek,
      lastGameweek,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const fixtures = await prisma.fixture.findMany();
  const weeks = fixtures.reduce((acc: number[], fixture) => {
    if (acc.indexOf(fixture.gameweek) === -1) {
      acc.push(fixture.gameweek);
    }
    return acc;
  }, []);

  const paths = weeks.map((x) => ({
    params: { weekId: x.toString() },
  }));

  return {
    paths,
    fallback: true,
  };
};

export default PredictionsPage;
