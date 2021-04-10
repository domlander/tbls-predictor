import React from "react";
import styled from "styled-components";

import colours from "@/styles/colours";
import { User } from "@prisma/client";
import { positionify } from "@/utils";

type LeagueTableEntry = {
  id: User["id"];
  username: User["username"];
  score: number;
};

interface Props {
  entries: LeagueTableEntry[];
}

const LeagueTable = ({ entries }: Props) => {
  const orderedEntries = entries.sort((a, b) => a.score - b.score);

  return (
    <Container>
      <Table>
        <Body>
          {orderedEntries.map((x, i) => (
            <Row>
              <Item>{positionify(i + 1)}</Item>
              <Item>{x.username}</Item>
              <Item>{x.score}</Item>
            </Row>
          ))}
        </Body>
      </Table>
    </Container>
  );
};

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
