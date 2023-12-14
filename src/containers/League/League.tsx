import User from "src/types/User";
import WeeklyScoresTable from "src/components/WeeklyScoresTable";
import LeagueAdminLink from "src/components/LeagueAdminLink";
import Heading from "src/components/Heading";
import Link from "next/link";
import styles from "./League.module.css";

interface Props {
  id: number;
  name: string;
  gameweekStart: number;
  gameweekEnd: number;
  administratorId: string;
  users: Pick<User, "id" | "username" | "totalPoints" | "weeklyPoints">[];
  fixtureWeeksAvailable: number[] | null;
}

const LeagueContainer = ({
  id,
  name: leagueName,
  gameweekStart,
  gameweekEnd,
  administratorId,
  users,
  fixtureWeeksAvailable,
}: Props) => {
  return (
    <>
      <div className={styles.container}>
        <LeagueAdminLink administratorId={administratorId} leagueId={id} />

        <section className={styles.table}>
          <Heading level="h2" as="h1" variant="secondary">
            {leagueName}
          </Heading>
          {!fixtureWeeksAvailable?.length ? (
            <section>
              <p className={styles.notStartedText}>
                This league does not start until gameweek{" "}
                <Link
                  className={styles.notStartedLink}
                  href={`/predictions/${gameweekStart}`}
                >
                  {gameweekStart}
                </Link>
              </p>
              <p className={styles.notStartedText}>Come back later.</p>
            </section>
          ) : (
            <WeeklyScoresTable
              users={users}
              leagueId={id}
              fixtureWeeksAvailable={fixtureWeeksAvailable}
            />
          )}
        </section>

        <p className={styles.finalWeekText}>
          The league runs until gameweek {gameweekEnd}
        </p>
      </div>
    </>
  );
};

export default LeagueContainer;
