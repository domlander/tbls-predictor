import React from "react";
import styled from "styled-components";

import colours from "@/styles/colours";
import { Participant, UserWeeklyScore, WeeklyScores } from "@/types";

interface Props {
  participants: Participant[];
  weeklyScores: WeeklyScores[];
  totalScores: UserWeeklyScore[];
}

const maxUsernameLength = 8;

const LeagueTable = ({ participants, weeklyScores, totalScores }: Props) => (
  <Container>
    <Table>
      <Header>
        <HeaderRow>
          <HeaderItemBlank />
          {participants.map((user) => (
            <HeaderItem key={user.id}>
              {user.username.length > maxUsernameLength
                ? `${user.username.substring(0, maxUsernameLength - 2)}...`
                : user.username}
            </HeaderItem>
          ))}
        </HeaderRow>
      </Header>
      <Body>
        {weeklyScores.map((weeksScores) => (
          <BodyRow key={weeksScores.week}>
            <BodyItemFirst>Week {weeksScores.week}</BodyItemFirst>
            {weeksScores.users.map((user) => (
              <BodyItem key={user.id}>{user.score}</BodyItem>
            ))}
          </BodyRow>
        ))}
      </Body>
      <Footer>
        <FooterRow>
          <FooterItem>Total</FooterItem>
          {totalScores.map((x) => (
            <FooterItem key={x.id}>{x.score}</FooterItem>
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
  background: ${colours.grey100};
  border-radius: 0.1em;
`;

export default LeagueTable;
