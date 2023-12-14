"use client";

import { Fragment } from "react";
import styled from "styled-components";
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
        <AllPoints
          $numWeeks={fixtureWeeksAvailable.length}
          $numParticipants={users.length}
        >
          <div className={styles.blankTableHeaderItem} />
          {fixtureWeeksAvailable.map((week) => (
            <div className={styles.headerItem} key={week}>
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
          <div />
          {users.map(({ id, weeklyPoints }) => (
            <Fragment key={id}>
              <div />
              {weeklyPoints?.map(({ week, points }) => (
                <div className={styles.tableData} key={`${id}${week}`}>
                  {points}
                </div>
              ))}
              <div />
            </Fragment>
          ))}
        </AllPoints>
      </div>
    </div>
  );
};

const AllPoints = styled.div<{ $numWeeks: number; $numParticipants: number }>`
  display: grid;
  grid-template-columns: ${({ $numWeeks }) =>
    `20px repeat(${$numWeeks}, 70px) 20px`};
  grid-template-rows: ${({ $numParticipants }) =>
    `58px repeat(${$numParticipants}, 72px)`};
  color: var(--grey200);
  transform: rotateX(180deg);
  -webkit-transform: rotateX(180deg);

  @media (max-width: 728px) {
    grid-template-columns: ${({ $numWeeks }) =>
      `12px repeat(${$numWeeks}, 44px) 12px`};
    grid-template-rows: ${({ $numParticipants }) =>
      `37px repeat(${$numParticipants}, 50px)`};
  }

  > div {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

export default WeeklyScoresTable;
