import User from "src/types/User";
import WeeklyScoresTable from "src/components/WeeklyScoresTable";
import LeagueAdminLink from "src/components/LeagueAdminLink";
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
  name,
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
        <WeeklyScoresTable
          leagueName={name}
          users={users}
          leagueId={id}
          gameweekStart={gameweekStart}
          fixtureWeeksAvailable={fixtureWeeksAvailable}
        />
        <p className={styles.finalWeekText}>
          The league runs until gameweek {gameweekEnd}
        </p>
      </div>
    </>
  );
};

export default LeagueContainer;
