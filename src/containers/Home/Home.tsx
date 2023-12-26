import Link from "next/link";

import type Fixture from "src/types/Fixture";
import type TeamFixtures from "src/types/TeamFixtures";
import MyLeagues from "src/components/MyLeagues";
import Heading from "src/components/Heading";
import UserLeague from "src/types/UserLeague";
import Prediction from "src/types/Prediction";
import UserStats from "src/components/UserStats";
import Predictions from "../Predictions";
import styles from "./Home.module.css";

interface Props {
  weekId: number;
  fixtures: Fixture[];
  predictions: Prediction[];
  recentFixturesByTeam: TeamFixtures[];
  activeLeagues: UserLeague[];
}

const Home = ({
  weekId,
  fixtures,
  predictions,
  recentFixturesByTeam,
  activeLeagues,
}: Props) => {
  return (
    <section className={styles.container}>
      <article className={styles.predictions}>
        <div className={styles.predictionsHeader}>
          <Heading level="h2" as="h1" variant="secondary">
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
      <UserStats />
      <MyLeagues leagues={activeLeagues} loading={false} />
    </section>
  );
};

export default Home;
