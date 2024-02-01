import { chivoMono } from "app/fonts";
import userStats from "src/actions/userStats";
import styles from "./UserStats.module.css";
import Heading from "../Heading";
import Link from "next/link";

const UserStats = async () => {
  const stats = await userStats();

  const numPredictions = stats?.numPredictions.toString();
  const perfectPerc = stats?.perfectPerc?.toFixed(1);
  const correctPerc = stats?.correctPerc.toFixed(1);

  if (!numPredictions || !perfectPerc || !correctPerc) {
    return null;
  }

  return (
    <UserStatsComponent
      numPredictions={numPredictions}
      perfectPerc={perfectPerc}
      correctPerc={correctPerc}
    />
  );
};

const UserStatsComponent = ({
  numPredictions,
  perfectPerc,
  correctPerc,
}: {
  numPredictions: string;
  perfectPerc: string;
  correctPerc: string;
}) => {
  return (
    <article className={styles.container}>
      <Heading level="h2" as="h1">
        My stats
      </Heading>
      <div className={styles.stats}>
        <div className={styles.stat}>
          Total predictions
          <div className={[chivoMono.className, styles.statPerc].join(" ")}>
            {numPredictions}
          </div>
        </div>
        <div className={styles.stat}>
          Perfect %
          <div className={[chivoMono.className, styles.statPerc].join(" ")}>
            {perfectPerc}
          </div>
        </div>
        <div className={styles.stat}>
          Correct %
          <div className={[chivoMono.className, styles.statPerc].join(" ")}>
            {correctPerc}
          </div>
        </div>
      </div>
      <div className={styles.predictedTable}>
        <Link href="/predictedtable">My predicted table</Link>
      </div>
    </article>
  );
};

export default UserStats;
