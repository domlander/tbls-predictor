import React from "react";
import styled from "styled-components";
import Link from "next/link";

import colours from "@/styles/colours";
import { UserTotalPoints, WeeklyPoints } from "@/types";

interface Props {
  users: UserTotalPoints[];
  pointsByWeek: WeeklyPoints[];
  leagueId: number;
}

const maxUsernameLength = 5;

const LeagueTable = ({ users, pointsByWeek, leagueId }: Props) => (
  <Container>
    <HeaderItemBlank />
    {users.map(({ userId, username }) => (
      <HeaderItem key={userId}>
        {username.length > maxUsernameLength
          ? `${username.substring(0, maxUsernameLength - 2)}...`
          : username}
      </HeaderItem>
    ))}
    {pointsByWeek.map(({ week, points }) => (
      <React.Fragment key={week}>
        <BodyItemFirst>
          <Link href={`/league/${leagueId}/week/${week}`}>
            <a>{`Week ${week}`}</a>
          </Link>
        </BodyItemFirst>
        {points.map((weekPoint, i) => (
          <BodyItem key={i}>{weekPoint}</BodyItem>
        ))}
      </React.Fragment>
    ))}
    <FooterItem>Total</FooterItem>
    {users.map(({ userId, totalPoints }) => (
      <FooterItem key={userId}>{totalPoints}</FooterItem>
    ))}
  </Container>
);

const Container = styled.div`
  max-width: 500px;
  background: ${colours.blackblue500};
  margin: 4em auto;
  font-size: 16px;
  display: grid;
  grid-template-columns: 6em 4.5em 4.5em;
  grid-auto-rows: 2.5em;
  border-bottom: 1px solid ${colours.grey500};
  border-right: 1px solid ${colours.grey500};

  > div {
    display: flex;
    justify-content: center;
    align-items: center;
    :not(:first-child) {
      border-top: 1px solid ${colours.grey500};
      border-left: 1px solid ${colours.grey500};
    }
  }
`;

const HeaderItem = styled.div`
  font-size: 14px;
  font-weight: 700;
`;

const HeaderItemBlank = styled(HeaderItem)`
  background-color: ${colours.blackblue400};
`;

const BodyItem = styled.div``;

const BodyItemFirst = styled(BodyItem)`
  font-size: 14px;
  text-decoration: underline;
  text-underline-offset: 2px;

  :hover,
  :focus {
    color: ${colours.blue100};
    text-decoration: underline;
  }
`;

const FooterItem = styled.div`
  font-size: 14px;
  font-weight: 700;
`;

export default LeagueTable;
