import userStats from "src/actions/userStats";
import styles from "./UserStats.module.css";
import Heading from "../Heading";

const UserStats = async () => {
  const { perfectPerc, correctPerc } = await userStats();

  return (
    <article className={styles.container}>
      <Heading level="h2" as="h1" variant="secondary">
        My stats
      </Heading>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <div>Perfect %</div>
          <div className={styles.statPerc}>
            {perfectPerc?.toFixed(1) ?? "???"}
          </div>
        </div>
        <div className={styles.stat}>
          <div>Correct %</div>
          <div className={styles.statPerc}>
            {correctPerc?.toFixed(1) ?? "???"}
          </div>
        </div>
      </div>
    </article>
  );
};

export default UserStats;
