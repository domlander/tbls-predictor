import React from "react";
import styled from "styled-components";

import colours from "@/styles/colours";
import { positionify } from "@/utils";
import { UserWeeklyScore } from "@/types";

interface Props {
  totalScores: UserWeeklyScore[];
}

const LeagueTable = ({ totalScores }: Props) => (
  <Container>
    <Table>
      <Body>
        {totalScores.map((user, i) => (
          <Row key={user.id}>
            <Item>{positionify(i + 1)}</Item>
            <Item>{user.username}</Item>
            <Item>{user.score}</Item>
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
  background: ${colours.grey100};
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
