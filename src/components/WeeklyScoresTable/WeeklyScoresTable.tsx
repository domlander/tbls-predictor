import React from "react";
import styled from "styled-components";

import colours from "@/styles/colours";
import { UserTotalPoints, WeeklyPoints } from "@/types";

interface Props {
  users: UserTotalPoints[];
  pointsByWeek: WeeklyPoints[];
}

const maxUsernameLength = 8;

const LeagueTable = ({ users, pointsByWeek }: Props) => (
  <Container>
    <Table>
      <Header>
        <HeaderRow>
          <HeaderItemBlank />
          {users.map(({ userId, username }) => (
            <HeaderItem key={userId}>
              {username.length > maxUsernameLength
                ? `${username.substring(0, maxUsernameLength - 2)}...`
                : username}
            </HeaderItem>
          ))}
        </HeaderRow>
      </Header>
      <Body>
        {pointsByWeek.map(({ week, points }) => (
          <BodyRow key={week}>
            <BodyItemFirst>{`Week ${week}`}</BodyItemFirst>
            {points.map((weekPoint, i) => (
              <BodyItem key={i}>{weekPoint}</BodyItem>
            ))}
          </BodyRow>
        ))}
      </Body>
      <Footer>
        <FooterRow>
          <FooterItem>Total</FooterItem>
          {users.map(({ userId, totalPoints }) => (
            <FooterItem key={userId}>{totalPoints}</FooterItem>
          ))}
        </FooterRow>
      </Footer>
    </Table>
  </Container>
);

const Container = styled.div`
  margin: 6em auto;
  max-width: 500px;
`;

const Header = styled.thead`
  height: 2em;
`;

const HeaderRow = styled.tr`
  height: 2em;
`;

const HeaderItem = styled.th`
  text-align: center;
  min-width: 5em;
  border: 1px solid ${colours.grey300};
`;

const HeaderItemBlank = styled(HeaderItem)`
  border: none;
  background-color: ${colours.blackblue400};
`;

const Body = styled.tbody`
  border: 1px solid ${colours.grey300};
`;

const BodyRow = styled.tr`
  height: 2em;
`;

const BodyItem = styled.td`
  text-align: center;
`;

const BodyItemFirst = styled(BodyItem)`
  border: 1px solid ${colours.grey300};
`;

const Footer = styled.tfoot``;

const FooterRow = styled.tr`
  height: 2em;
`;

const FooterItem = styled.td`
  text-align: center;
  border: 1px solid ${colours.grey300};
`;

const Table = styled.table`
  width: 100%;
  margin: 0 auto;
  background: ${colours.blackblue500};
  border-radius: 0.1em;
`;

export default LeagueTable;
