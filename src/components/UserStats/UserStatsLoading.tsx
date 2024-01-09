import styles from "./UserStats.module.css";
import Heading from "../Heading";

const UserStatsLoading = () => {
  return (
    <article className={styles.container}>
      <Heading level="h2" as="h1">
        My stats
      </Heading>
      <div className={styles.stats}>
        <div className={styles.stat}>
          Total predictions
          <div className={styles.loading} />
        </div>
        <div className={styles.stat}>
          Perfect %
          <div className={styles.loading} />
        </div>
        <div className={styles.stat}>
          Correct %
          <div className={styles.loading} />
        </div>
      </div>
    </article>
  );
};

export default UserStatsLoading;
