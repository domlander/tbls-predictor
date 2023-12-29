import userStats from "src/actions/userStats";
import styles from "./UserStats.module.css";
import Heading from "../Heading";

const UserStats = async () => {
  const stats = await userStats();

  const numPredictions = stats?.numPredictions.toString() ?? "???";
  const perfectPerc = stats?.perfectPerc?.toFixed(1) ?? "???";
  const correctPerc = stats?.correctPerc.toFixed(1) ?? "???";

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
      <Heading level="h2" as="h1" variant="secondary">
        My stats
      </Heading>
      <div className={styles.stats}>
        <div className={styles.stat}>
          Total predictions
          <div className={styles.statPerc}>{numPredictions}</div>
        </div>
        <div className={styles.stat}>
          Perfect %<div className={styles.statPerc}>{perfectPerc}</div>
        </div>
        <div className={styles.stat}>
          Correct %<div className={styles.statPerc}>{correctPerc}</div>
        </div>
      </div>
    </article>
  );
};

export default UserStats;
