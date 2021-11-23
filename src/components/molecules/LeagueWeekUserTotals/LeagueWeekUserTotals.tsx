import React from "react";
import styled from "styled-components";

import LeagueWeekUserScore from "../LeagueWeekUserScore";
import { UserTotalPointsWeek } from "../../../types";
import pageSizes from "../../../styles/pageSizes";

export type Props = {
  users: UserTotalPointsWeek[];
};

const LeagueWeekUserTotals = ({ users }: Props) => (
  <Container numUsers={users.length}>
    {users.map(({ userId, username }) => (
      <Username key={userId}>{username}</Username>
    ))}
    {users.map(({ userId, totalPoints }) => (
      <LeagueWeekUserScore key={userId} score={totalPoints} />
    ))}
  </Container>
);

const Container = styled.div<{ numUsers: number }>`
  width: 100%;
  margin: 0.8em auto;
  display: grid;
  grid-template-columns: ${({ numUsers }) => `repeat(${numUsers}, 1fr)`};
  justify-items: center;
`;

const Username = styled.div`
  margin-top: 0.75em;
  text-align: center;
  text-decoration: underline;
  text-underline-offset: 0.2em;
  font-size: 1.2rem;

  @media (max-width: ${pageSizes.tablet}) {
    font-size: 0.8rem;
  }
`;

export default LeagueWeekUserTotals;
