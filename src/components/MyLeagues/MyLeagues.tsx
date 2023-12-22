import Link from "next/link";

import Heading from "src/components/Heading";
import LeaguesCardsList from "src/components/LeaguesCardsList";
import UserLeague from "src/types/UserLeague";
import styles from "./MyLeagues.module.css";

export interface Props {
  leagues: UserLeague[];
  loading: boolean;
}

const MyLeagues = ({ leagues, loading }: Props) => {
  if (!loading && !leagues?.length) {
    return (
      <section className={styles.noLeagues}>
        <Link className={styles.join} href="/league/join">
          Join a league
        </Link>
      </section>
    );
  }

  return (
    <section className={styles.container}>
      <Heading level="h2" as="h1" variant="secondary">
        My leagues
      </Heading>
      {loading ? (
        <div className={styles.skeleton}>
          <div className={styles.skeletonInner} />
        </div>
      ) : (
        <LeaguesCardsList leagues={leagues} />
      )}
    </section>
  );
};

export default MyLeagues;
