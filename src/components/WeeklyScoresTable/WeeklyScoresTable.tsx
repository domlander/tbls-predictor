import { Fragment } from "react";
import Link from "next/link";

import User from "src/types/User";
import styles from "./WeeklyScoresTable.module.css";

export interface Props {
  users: Pick<User, "id" | "username" | "totalPoints" | "weeklyPoints">[];
  leagueId: number;
  fixtureWeeksAvailable: number[];
}

const WeeklyScoresTable = ({
  users,
  leagueId,
  fixtureWeeksAvailable,
}: Props) => {
  return (
    <div className={styles.table}>
      <div className={styles.participantsAndTotalPoints}>
        <div className={styles.headerItemBlank} />
        {users.map(({ id, username, totalPoints }) => (
          <Fragment key={id}>
            <div className={styles.participant}>
              <a href={`/predictedtable/${id}`}>{username}</a>
            </div>
            <div className={styles.totalPoints}>{totalPoints}</div>
          </Fragment>
        ))}
      </div>
      <div className={styles.allPointsWrapper}>
        <div className={styles.allPoints}>
          <div className={styles.allPointsHeader}>
            <div className={styles.headerDataBlank} />
            {fixtureWeeksAvailable.map((week) => (
              <div className={styles.headerData} key={week}>
                {fixtureWeeksAvailable.indexOf(week) !== -1 ? (
                  <Link
                    className={styles.clickableRowHeading}
                    href={`/league/${leagueId}/week/${week}`}
                  >
                    <p className={styles.weekText}>Week</p>
                    <p className={styles.weekNumber}>{week}</p>
                  </Link>
                ) : (
                  <div>{`Week ${week}`}</div>
                )}
              </div>
            ))}
            <div className={styles.headerDataBlank} />
          </div>
          {users.map(({ id, weeklyPoints }) => (
            <div key={id} className={styles.allPointsData}>
              <div className={styles.tableDataBlank} />
              {weeklyPoints?.map(({ week, points }) => (
                <div className={styles.tableData} key={`${id}${week}`}>
                  {points}
                </div>
              ))}
              <div className={styles.tableDataBlank} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeeklyScoresTable;
