"use client";

import styled from "styled-components";

import UserPoints from "src/types/UserPoints";
import colours from "src/styles/colours";
import LeagueWeekUserScore from "../LeagueWeekUserScore";

export type Props = {
  users: UserPoints[];
};

const LeagueWeekUserTotals = ({ users }: Props) => {
  return (
    <Container $numUsers={users.length}>
      {users.map(({ id, username }) => (
        <Username key={id}>{username}</Username>
      ))}
      {users.map(({ id, points }) => (
        <LeagueWeekUserScore key={id} score={points} />
      ))}
    </Container>
  );
};

const Container = styled.div<{ $numUsers: number }>`
  width: 100%;
  padding: 2em 0 1em;
  margin-bottom: 1.4em;
  display: grid;
  grid-template-columns: ${({ $numUsers }) => `repeat(${$numUsers}, 1fr)`};
  justify-items: center;
  gap: 1.4em;
  position: sticky;
  top: 0;
  background: var(--blackblue400opacity75);
  /* box-shadow: offset-x | offset-y | blur-radius | color */
  box-shadow: 0 1em 1em var(--blackblue400opacity75);

  @media (max-width: 768px) {
    padding: 1.6em 0 0.8em;
    margin-bottom: 1.2em;
    gap: 1.2em;
  }
`;

const Username = styled.div`
  text-align: center;
  color: var(--grey200);
  font-size: 1.2rem;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

export default LeagueWeekUserTotals;
