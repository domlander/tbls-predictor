import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";

import prisma from "prisma/client";
import Predictions from "src/containers/Predictions";
import Fixture from "src/types/Fixture";
import { convertUrlParamToNumber } from "utils/convertUrlParamToNumber";
import sortFixtures from "utils/sortFixtures";
import generateRecentFixturesByTeam from "utils/generateRecentFixturesByTeam";
import { authOptions } from "app/api/auth/[...nextauth]/route";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

type Params = { weekId: string };

const Page = async ({ params }: { params: Params }) => {
  const weekId = convertUrlParamToNumber(params?.weekId);
  if (!weekId || weekId <= 0) return redirect("/");

  const session = await getServerSession(authOptions);
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

  const predictions = await prisma.prediction.findMany({
    where: {
      AND: [
        { userId: session.user.id },
        {
          fixture: {
            gameweek: weekId,
          },
        },
      ],
    },
    include: {
      user: {
        select: {
          id: true,
        },
      },
    },
  });

  return (
    <div className={styles.container}>
      <Predictions
        fixtures={sortFixtures(thisGwFixtures)}
        predictions={predictions}
        weekId={weekId}
        recentFixturesByTeam={JSON.parse(JSON.stringify(recentFixturesByTeam))}
        firstGameweek={firstGameweek}
        lastGameweek={lastGameweek}
      />
    </div>
  );
};

export default Page;
