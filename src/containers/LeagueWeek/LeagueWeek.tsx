import Link from "next/link";
import Image from "next/image";

import UserPoints from "src/types/UserPoints";
import Fixture from "src/types/Fixture";
import sortFixtures from "utils/sortFixtures";
import WeekNavigator from "src/components/WeekNavigator";
import LeagueWeekUserTotals from "src/components/LeagueWeekUserTotals";
import LeagueWeekFixtures from "src/components/LeagueWeekFixtures";
import styles from "./LeagueWeek.module.css";

interface Props {
  leagueId: number;
  leagueName: string;
  weekId: number;
  usersGameweekPoints: UserPoints[];
  fixtures: Fixture[];
  firstGameweek: number;
  lastGameweek: number;
}

const LeagueWeekContainer = ({
  leagueId,
  leagueName,
  weekId: gameweek,
  usersGameweekPoints,
  fixtures,
  firstGameweek,
  lastGameweek,
}: Props) => {
  const sortedFixtures = sortFixtures(fixtures);

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <nav className={styles.breadcrumbs} aria-label="breadcrumbs">
          <ul className={styles.breadcrumbsList}>
            <li className={styles.breadcrumbsItem}>
              <Link
                className={styles.breadcrumbsLink}
                href={`/league/${leagueId}`}
                passHref
              >
                {leagueName}
              </Link>
            </li>
            <li className={styles.breadcrumbsItem}>
              <p className={styles.breadcrumbsText}>{`Gameweek ${gameweek}`}</p>
            </li>
          </ul>
        </nav>
      </div>
      <>
        <WeekNavigator
          week={gameweek}
          prevGameweekUrl={
            gameweek === firstGameweek
              ? undefined
              : `/league/${leagueId}/week/${gameweek - 1}`
          }
          nextGameweekUrl={
            gameweek === lastGameweek
              ? undefined
              : `/league/${leagueId}/week/${gameweek + 1}`
          }
        />
        <section className={styles.scoresContainer}>
          <LeagueWeekUserTotals users={usersGameweekPoints} />
          {!fixtures?.length ? (
            <div className={styles.loading}>
              <p className={styles.loadingText}>Loading...</p>
              <div className={styles.spinner}>
                <Image
                  src="/images/spinner.gif"
                  height="40"
                  width="40"
                  alt=""
                />
              </div>
            </div>
          ) : (
            <LeagueWeekFixtures weekId={gameweek} fixtures={sortedFixtures} />
          )}
        </section>
      </>
    </div>
  );
};

export default LeagueWeekContainer;
