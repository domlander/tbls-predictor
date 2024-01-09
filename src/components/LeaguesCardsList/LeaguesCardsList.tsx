import Link from "next/link";

import Heading from "src/components/Heading";
import UserLeague from "src/types/UserLeague";
import { positionify } from "utils/positionify";
import styles from "./LeaguesCardsList.module.css";

export interface Props {
  leagues: UserLeague[];
}

const LeaguesCardsList = ({ leagues }: Props) => {
  return (
    <article className={styles.container}>
      {leagues.map(
        ({
          leagueId: id,
          leagueName: name,
          weeksToGo,
          weeksUntilStart,
          position,
          numParticipants,
        }) => {
          const displayPosition = position ? positionify(position) : null;
          const isPositionRelevant = displayPosition && !weeksUntilStart;

          return (
            <section className={styles.leagueCard} key={id} tabIndex={0}>
              <Link href={`/league/${id}`} tabIndex={-1}>
                <Heading level="h2">{name}</Heading>
                {isPositionRelevant &&
                  (weeksToGo ? (
                    <p className={styles.leagueCardText}>
                      Current position:{" "}
                      <span className={styles.bold}>{displayPosition}</span> of{" "}
                      <span className={styles.bold}>{numParticipants}</span>
                    </p>
                  ) : (
                    <p className={styles.leagueCardText}>
                      You finished:{" "}
                      <span className={styles.bold}>{displayPosition}</span> of{" "}
                      <span className={styles.bold}>{numParticipants}</span>
                    </p>
                  ))}
                {weeksUntilStart ? (
                  <p className={styles.leagueCardText}>
                    League starts in{" "}
                    <span className={styles.bold}>{weeksUntilStart}</span>{" "}
                    gameweek{weeksUntilStart === 1 ? "" : "s"}!
                  </p>
                ) : weeksToGo ? (
                  <p className={styles.leagueCardText}>
                    Weeks remaining:{" "}
                    <span className={styles.bold}>{weeksToGo}</span>
                  </p>
                ) : null}
              </Link>
            </section>
          );
        }
      )}
    </article>
  );
};

export default LeaguesCardsList;
