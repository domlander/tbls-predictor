import Link from "next/link";
import { Suspense } from "react";

import type Fixture from "src/types/Fixture";
import type TeamFixtures from "src/types/TeamFixtures";
import Heading from "src/components/Heading";
import MyLeagues from "src/components/MyLeagues";
import MyLeaguesLoading from "src/components/MyLeagues/MyLeaguesLoading";
import UserStats from "src/components/UserStats";
import UserStatsLoading from "src/components/UserStats/UserStatsLoading";
import Prediction from "src/types/Prediction";
import User from "src/types/User";
import Predictions from "../Predictions";
import styles from "./Home.module.css";

interface Props {
  weekId: number;
  fixtures: Fixture[];
  predictions: Prediction[];
  recentFixturesByTeam: TeamFixtures[];
  userId: User["id"];
  currentGameweek: number;
}

const Home = ({
  weekId,
  fixtures,
  predictions,
  recentFixturesByTeam,
  userId,
}: Props) => {
  return (
    <section className={styles.container}>
      <article className={styles.predictions}>
        <div className={styles.predictionsHeader}>
          <Heading level="h2" as="h1">
            Gameweek {weekId}
          </Heading>
          <Link
            className={styles.predictionsHeaderLink}
            href={`/predictions/${weekId}`}
          >
            All predictions
          </Link>
        </div>
        <Predictions
          fixtures={fixtures}
          predictions={predictions}
          weekId={weekId}
          recentFixturesByTeam={recentFixturesByTeam}
        />
      </article>
      <Suspense fallback={<UserStatsLoading />}>
        <UserStats />
      </Suspense>
      <Suspense fallback={<MyLeaguesLoading />}>
        <MyLeagues userId={userId} />
      </Suspense>
    </section>
  );
};

export default Home;
