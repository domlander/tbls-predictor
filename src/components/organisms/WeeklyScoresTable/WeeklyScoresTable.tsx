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
}

const maxUsernameLength = 5;

const WeeklyScoresTable = ({ users, pointsByWeek, leagueId }: Props) => (
  <Container>
    <ScoresHeading level="h2">Weeks</ScoresHeading>
    <Table numUsers={users.length}>
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
    </Table>
  </Container>
);

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 4em;
`;

const ScoresHeading = styled(Heading)`
  margin: 0.4em 0;
  @media (max-width: ${pageSizes.mobileL}) {
    font-size: 30px;
  }
`;

const Table = styled.div<{ numUsers: number }>`
  width: fit-content;
  background-color: ${colours.whiteOpacity02};
  font-size: 24px;
  display: grid;
  grid-template-columns: ${({ numUsers }) => `6em repeat(${numUsers}, 4.5em)`};
  grid-auto-rows: 3em;

  @media (max-width: ${pageSizes.tablet}) {
    font-size: 20px;
  }

  > div {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const HeaderItem = styled.div`
  font-weight: 700;
`;

const HeaderItemBlank = styled(HeaderItem)`
  background-color: ${colours.blackblue400};
`;

const BodyItem = styled.div``;

const BodyItemFirst = styled(BodyItem)`
  text-decoration: underline;
  text-underline-offset: 2px;

  :hover,
  :focus {
    color: ${colours.blue100};
    text-decoration: underline;
  }
`;

const FooterItem = styled.div`
  font-weight: 700;
`;

export default WeeklyScoresTable;
