import styled from "styled-components";
import React from "react";
import { UserTotalPointsWeek } from "@/types";
import colours from "../../../styles/colours";

export type Props = {
  users: UserTotalPointsWeek[];
};

const LeagueWeekUserTotals = ({ users }: Props) => (
  <Container numUsers={users.length}>
    {users.map(({ userId, username }) => (
      <Username key={userId}>{username}</Username>
    ))}
    {users.map(({ userId, totalPoints }) => (
      <Total key={userId}>{totalPoints}</Total>
    ))}
  </Container>
);

const Container = styled.div<{ numUsers: number }>`
  width: 100%;
  background-color: ${colours.blackblue500opacity50};
  display: grid;
  grid-template-columns: ${({ numUsers }) => `repeat(${numUsers}, 1fr)`};
  justify-items: center;
  border-radius: 4px;
`;

const Username = styled.div`
  margin-top: 12px;
  font-size: 13px;
  text-decoration: underline;
  text-underline-offset: 3px;
`;

const Total = styled.div`
  margin: 4px 0 8px;
  font-family: "Patrick Hand", cursive;
  font-size: 32px;
`;

export default LeagueWeekUserTotals;
