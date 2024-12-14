import { redirect } from "next/navigation";
import { auth } from "auth";

import prisma from "prisma/client";
import Predictions from "src/containers/Predictions";
import Fixture from "src/types/Fixture";
import { convertUrlParamToNumber } from "utils/convertUrlParamToNumber";
import sortFixtures from "utils/sortFixtures";
import generateRecentFixturesByTeam from "utils/generateRecentFixturesByTeam";

import styles from "./page.module.css";

export const dynamic = "force-dynamic";

type Params = { weekId: string };

const Page = async (props: { params: Promise<Params> }) => {
  const params = await props.params;
  const weekId = convertUrlParamToNumber(params?.weekId);
  if (!weekId || weekId <= 0) return redirect("/");

  const session = await auth();
  if (!session?.user.id) {
    return redirect("/signIn");
  }

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
    <div className={styles.container}>
      <Predictions
        fixtures={sortFixtures(thisGwFixtures)}
        weekId={weekId}
        recentFixturesByTeam={JSON.parse(JSON.stringify(recentFixturesByTeam))}
        firstGameweek={firstGameweek}
        lastGameweek={lastGameweek}
      />
    </div>
  );
};

export default Page;
