import styled from "styled-components";
import React from "react";
import { UserTotalPointsWeek } from "@/types";
import pageSizes from "../../../styles/pageSizes";
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
  margin: 8px auto;
  background-color: ${colours.blackblue500opacity50};
  display: grid;
  grid-template-columns: ${({ numUsers }) => `repeat(${numUsers}, 1fr)`};
  justify-items: center;
  border-radius: 4px;
`;

const Username = styled.div`
  margin-top: 12px;
  text-decoration: underline;
  text-underline-offset: 3px;
  font-size: 16px;

  @media (max-width: ${pageSizes.tablet}) {
    font-size: 13px;
  }
`;

const Total = styled.div`
  margin: 4px 0 8px;
  font-family: "Patrick Hand", cursive;
  font-size: 32px;
`;

export default LeagueWeekUserTotals;
