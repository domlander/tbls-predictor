import { Suspense } from "react";
import Link from "next/link";

import WeekNavigator from "src/components/WeekNavigator";
import type Fixture from "src/types/Fixture";
import type Prediction from "src/types/Prediction";
import type TeamFixtures from "src/types/TeamFixtures";
import type User from "src/types/User";
import styles from "./Predictions.module.css";
import PredictionsFetchData from "./PredictionsFetchData";
import PredictionsTableLoading from "src/components/PredictionsTable/PredictionsTableLoading";

export type UpdatePredictionsInputType = {
  userId: User["id"];
  fixtureId: Fixture["id"];
  homeGoals: Prediction["homeGoals"];
  awayGoals: Prediction["awayGoals"];
  bigBoyBonus: Prediction["bigBoyBonus"];
  score: Prediction["score"];
};

interface Props {
  fixtures: Fixture[];
  weekId: number;
  recentFixturesByTeam: TeamFixtures[];
  firstGameweek?: number;
  lastGameweek?: number;
}

const Predictions = async ({
  fixtures,
  weekId,
  recentFixturesByTeam,
  firstGameweek,
  lastGameweek,
}: Props) => {
  if (!fixtures?.length)
    return (
      <section className={styles.noFixtures}>
        <p>No fixtures found for gameweek {weekId}</p>
        <p>
          Go to{" "}
          <Link className={styles.noFixturesLink} href="/predictions">
            this weeks predictions
          </Link>
        </p>
      </section>
    );

  return (
    <div className={styles.container}>
      {weekId && firstGameweek && lastGameweek && (
        <WeekNavigator
          week={weekId}
          prevGameweekUrl={
            weekId === firstGameweek ? undefined : `/predictions/${weekId - 1}`
          }
          nextGameweekUrl={
            weekId < lastGameweek - firstGameweek + 1
              ? `/predictions/${weekId + 1}`
              : undefined
          }
        />
      )}
      <Suspense fallback={<PredictionsTableLoading fixtures={fixtures} />}>
        <PredictionsFetchData
          fixtures={fixtures}
          recentFixturesByTeam={recentFixturesByTeam}
          weekId={weekId}
        />
      </Suspense>
    </div>
  );
};

export default Predictions;
