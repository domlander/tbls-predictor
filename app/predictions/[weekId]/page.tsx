import { redirect } from "next/navigation";

import prisma from "prisma/client";
import Predictions from "src/containers/Predictions";
import Fixture from "src/types/Fixture";
import { convertUrlParamToNumber } from "utils/convertUrlParamToNumber";
import sortFixtures from "utils/sortFixtures";
import generateRecentFixturesByTeam from "utils/generateRecentFixturesByTeam";

export const revalidate = 30; // Revalidate at most every 30 seconds

type Params = { weekId: string };

const Page = async ({ params }: { params: Params }) => {
  const weekId = convertUrlParamToNumber(params?.weekId);
  if (!weekId || weekId <= 0) return redirect("/");

  const fixtures: Fixture[] = await prisma.fixture.findMany();

  const { firstGameweek, lastGameweek } = fixtures.reduce(
    (acc, fixture) => {
      if (fixture.gameweek < acc.firstGameweek) {
        acc.firstGameweek = fixture.gameweek;
      }
      if (fixture.gameweek > acc.lastGameweek) {
        acc.lastGameweek = fixture.gameweek;
      }
      return acc;
    },
    { firstGameweek: weekId, lastGameweek: weekId }
  );

  const thisGwFixtures = fixtures.filter(
    (fixture) => fixture.gameweek === weekId
  );

  const recentFixturesByTeam = generateRecentFixturesByTeam(fixtures, weekId);

  return (
    <Predictions
      fixtures={sortFixtures(thisGwFixtures)}
      weekId={weekId}
      recentFixturesByTeam={JSON.parse(JSON.stringify(recentFixturesByTeam))}
      firstGameweek={firstGameweek}
      lastGameweek={lastGameweek}
    />
  );
};

export default Page;
