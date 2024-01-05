import UserPoints from "src/types/UserPoints";
import LeagueWeekUserScore from "../LeagueWeekUserScore";
import styles from "./LeagueWeekUserTotals.module.css";

export type Props = {
  users: UserPoints[];
};

const LeagueWeekUserTotals = ({ users }: Props) => {
  return (
    <div className={styles.container}>
      {users.map(({ id, username, points }) => (
        <div className={styles.user}>
          <div className={styles.name} key={id}>
            {username}
          </div>
          <LeagueWeekUserScore key={id} score={points} />
        </div>
      ))}
    </div>
  );
};

export default LeagueWeekUserTotals;
