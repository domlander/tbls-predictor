import React from "react";
import styled from "styled-components";

import { UserPoints } from "src/types/UserPoints";
import LeagueWeekUserScore from "../LeagueWeekUserScore";
import pageSizes from "../../../styles/pageSizes";

export type Props = {
  users: UserPoints[];
};

const LeagueWeekUserTotals = ({ users }: Props) => {
  return (
    <Container numUsers={users.length}>
      {users.map(({ userId, username }) => (
        <Username key={userId}>{username}</Username>
      ))}
      {users.map(({ userId, points }) => (
        <LeagueWeekUserScore key={userId} score={points} />
      ))}
    </Container>
  );
};

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
