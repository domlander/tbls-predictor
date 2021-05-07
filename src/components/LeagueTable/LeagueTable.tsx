import React from "react";
import styled from "styled-components";

import colours from "@/styles/colours";
import { positionify } from "@/utils";
import { UserTotalPoints } from "@/types";

interface Props {
  users: UserTotalPoints[];
}

const LeagueTable = ({ users }: Props) => (
  <Container>
    <Table>
      <Body>
        {users.map(({ userId, username, totalPoints }, i) => (
          <Row key={userId}>
            <Item>{positionify(i + 1)}</Item>
            <Item>{username}</Item>
            <Item>{totalPoints}</Item>
          </Row>
        ))}
      </Body>
    </Table>
  </Container>
);

const Container = styled.div`
  margin: 0 auto;
  max-width: 500px;
`;

const Table = styled.table`
  width: 100%;
  margin: 0 auto;
  background: ${colours.blackblue500};
  border-radius: 0.1em;
`;

const Body = styled.tbody``;

const Row = styled.tr`
  height: 2em;
`;

const Item = styled.td`
  text-align: center;
  border: 1px solid ${colours.grey300};
  padding: 0.75em;
`;

export default LeagueTable;
