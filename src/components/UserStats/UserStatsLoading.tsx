import styles from "./UserStats.module.css";
import Heading from "../Heading";

const UserStatsLoading = () => {
  return (
    <article className={styles.container}>
      <Heading level="h2" as="h1" variant="secondary">
        My stats
      </Heading>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <div>Perfect %</div>
          <div className={styles.loading} />
        </div>
        <div className={styles.stat}>
          <div>Correct %</div>
          <div className={styles.loading} />
        </div>
      </div>
    </article>
  );
};

export default UserStatsLoading;
