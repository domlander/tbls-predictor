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

const Page = async ({ params }: Props) => {
  const weekId = convertUrlParamToNumber(params?.week);
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

/**
 * To find out: What about paths that are created after build time?
 * e.g. A new league is created. Can this new path be statically generated?
 * Does it need to be? Once there's a visit to that page, will the page be cached?
 */
export const generateStaticParams = async (): Promise<Params[]> => {
  const fixtures = await prisma.fixture.findMany();
  const weeks = fixtures.reduce((acc: number[], fixture) => {
    if (acc.indexOf(fixture.gameweek) === -1) {
      acc.push(fixture.gameweek);
    }
    return acc;
  }, []);

  return weeks.map((week) => ({
    week: week.toString(),
  }));
};

export default Page;
