import React from "react";
import styled from "styled-components";
import Link from "next/link";

import { UserTotalPoints, WeeklyPoints } from "@/types";
import pageSizes from "../../../styles/pageSizes";
import colours from "../../../styles/colours";
import Heading from "../../../components/atoms/Heading";

export interface Props {
  users: UserTotalPoints[];
  pointsByWeek: WeeklyPoints[];
  leagueId: number;
  fixtureWeeksAvailable: number[];
}

const maxUsernameLength = 10;

const WeeklyScoresTable = ({
  users,
  pointsByWeek,
  leagueId,
  fixtureWeeksAvailable,
}: Props) => {
  return (
    <Container>
      <ScoresHeading level="h2">Weeks</ScoresHeading>
      <Table numUsers={users.length}>
        <HeaderItemBlank />
        {users.map(({ userId, username }) => (
          <HeaderItem key={userId}>
            <p>
              {username.length > maxUsernameLength
                ? `${username.substring(0, maxUsernameLength - 2)}...`
                : username}
            </p>
          </HeaderItem>
        ))}
        <TotalScoresRow>Total</TotalScoresRow>
        {users.map(({ userId, totalPoints }) => (
          <TotalScoresRow key={userId}>{totalPoints}</TotalScoresRow>
        ))}
        {pointsByWeek.map(({ week, points }) => (
          <React.Fragment key={week}>
            <div>
              {fixtureWeeksAvailable.indexOf(week) !== -1 ? (
                <Link href={`/league/${leagueId}/week/${week}`}>
                  <ClickableRowHeading>{`Week ${week}`}</ClickableRowHeading>
                </Link>
              ) : (
                <div>{`Week ${week}`}</div>
              )}
            </div>
            {points.map((weekPoint, i) => (
              <div key={i}>{weekPoint}</div>
            ))}
          </React.Fragment>
        ))}
      </Table>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 4em;
`;

const ScoresHeading = styled(Heading)`
  margin: 0.4em 0;
`;

const Table = styled.div<{ numUsers: number }>`
  width: fit-content;
  background-color: ${colours.blackblue400opacity50};
  font-size: 1.5rem;
  display: grid;
  grid-template-columns: ${({ numUsers }) => `6em repeat(${numUsers}, 6em)`};
  grid-auto-rows: 3em;

  @media (max-width: ${pageSizes.tablet}) {
    font-size: 1.3rem;
    grid-template-columns: ${({ numUsers }) =>
      `5em repeat(${numUsers}, 4.5em)`};
  }

  > div {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const HeaderItem = styled.div`
  font-weight: 700;
  max-width: 100%;

  > p {
    max-width: 80%;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
  }
`;

const HeaderItemBlank = styled(HeaderItem)``;

const ClickableRowHeading = styled.a`
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 0.1em;

  :hover,
  :focus {
    color: ${colours.blue100};
    text-decoration: underline;
  }
`;

const TotalScoresRow = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  border-top: 1px solid grey;
  border-bottom: 1px solid ${colours.grey500};
`;

export default WeeklyScoresTable;
