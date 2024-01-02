import Link from "next/link";

import Heading from "src/components/Heading";
import LeaguesCardsList from "src/components/LeaguesCardsList";
import fetchUsersActiveLeagues from "src/actions/fetchUsersActiveLeagues";
import styles from "./MyLeagues.module.css";

type Props = {
  userId: string;
};

const MyLeagues = async ({ userId }: Props) => {
  const activeLeagues = await fetchUsersActiveLeagues(userId);

  return (
    <article className={styles.container}>
      <Heading level="h2" as="h1" variant="secondary">
        My leagues
      </Heading>
      {!activeLeagues?.length ? (
        <div className={styles.noLeagues}>
          <Link className={styles.join} href="/league/join">
            Join a league
          </Link>
        </div>
      ) : (
        <LeaguesCardsList leagues={activeLeagues} />
      )}
    </article>
  );
};

export default MyLeagues;
