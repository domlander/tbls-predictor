import Heading from "src/components/Heading";
import styles from "./MyLeagues.module.css";

const MyLeaguesLoading = () => {
  return (
    <article className={styles.container}>
      <Heading level="h2" as="h1" variant="secondary">
        My leagues
      </Heading>
      <div className={styles.skeleton}>
        <div className={styles.skeletonInner} />
      </div>
    </article>
  );
};

export default MyLeaguesLoading;
