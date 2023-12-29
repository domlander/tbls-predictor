import Link from "next/link";

import Heading from "src/components/Heading";
import LeaguesCardsList from "src/components/LeaguesCardsList";
import Fixture from "src/types/Fixture";
import getUsersActiveLeagues from "utils/getUsersActiveLeagues";
import styles from "./MyLeagues.module.css";

type Props = {
  userId: string;
  fixtures: Fixture[];
  currentGameweek: number;
};

const MyLeagues = async ({ userId, fixtures, currentGameweek }: Props) => {
  const activeLeagues = await getUsersActiveLeagues(
    userId,
    fixtures,
    currentGameweek
  );

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
