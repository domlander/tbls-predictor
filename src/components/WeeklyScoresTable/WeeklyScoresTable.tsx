"use client";

import { Fragment } from "react";
import styled from "styled-components";
import Link from "next/link";

import User from "src/types/User";
import pageSizes from "src/styles/pageSizes";
import colours from "src/styles/colours";
import Heading from "src/components/Heading";
import styles from "./WeeklyScoresTable.module.css";

export interface Props {
  leagueName: string;
  users: Pick<User, "id" | "username" | "totalPoints" | "weeklyPoints">[];
  leagueId: number;
  gameweekStart: number;
  fixtureWeeksAvailable: number[] | null;
}

const WeeklyScoresTable = ({
  leagueName,
  users,
  leagueId,
  gameweekStart,
  fixtureWeeksAvailable,
}: Props) => {
  return (
    <section className={styles.container}>
      <Heading level="h2" as="h1" variant="secondary">
        {leagueName}
      </Heading>
      {fixtureWeeksAvailable ? (
        <div className={styles.table}>
          <ParticipantsAndTotalPoints $numParticipants={users.length}>
            <div className={styles.headerItemBlank} />
            {users.map(({ id, username, totalPoints }) => (
              <Fragment key={id}>
                <div className={styles.participant}>
                  <a href={`/predictedtable/${id}`}>{username}</a>
                </div>
                <div className={styles.totalPoints}>{totalPoints}</div>
              </Fragment>
            ))}
          </ParticipantsAndTotalPoints>
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
                    <div key={`${id}${week}`}>{points}</div>
                  ))}
                  <div />
                </Fragment>
              ))}
            </AllPoints>
          </div>
        </div>
      ) : (
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
      )}
    </section>
  );
};

const ParticipantsAndTotalPoints = styled.div<{ $numParticipants: number }>`
  display: grid;
  grid-template-columns: 1fr 4em;
  grid-template-rows: ${({ $numParticipants }) =>
    `82px repeat(${$numParticipants}, 72px)`};
  color: ${colours.grey200};
  border-bottom: 1px solid ${colours.grey500opacity50};

  @media (max-width: ${pageSizes.tablet}) {
    grid-template-columns: 1fr 3.4em;
    grid-template-rows: ${({ $numParticipants }) =>
      `52px repeat(${$numParticipants}, 50px)`};
  }

  > div {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const AllPoints = styled.div<{ $numWeeks: number; $numParticipants: number }>`
  display: grid;
  grid-template-columns: ${({ $numWeeks }) =>
    `20px repeat(${$numWeeks}, 70px) 20px`};
  grid-template-rows: ${({ $numParticipants }) =>
    `58px repeat(${$numParticipants}, 72px)`};
  color: ${colours.grey200};
  transform: rotateX(180deg);
  -webkit-transform: rotateX(180deg);

  @media (max-width: ${pageSizes.tablet}) {
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
