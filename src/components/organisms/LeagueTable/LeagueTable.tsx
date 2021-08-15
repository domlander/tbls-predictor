import React from "react";
import styled from "styled-components";

import { positionify } from "utils/positionify";
import Heading from "../../../components/atoms/Heading";
import { UserTotalPoints } from "../../../types";
import colours from "../../../styles/colours";

export interface Props {
  users: UserTotalPoints[];
}

const LeagueTable = ({ users }: Props) => (
  <Container>
    <Heading level="h2">Table</Heading>
    <TableContainer>
      {users.map(({ userId, username, totalPoints }, i) => (
        <React.Fragment key={userId}>
          <Item position={i + 1}>{positionify(i + 1)}</Item>
          <span>|</span>
          <Item position={i + 1}>{username}</Item>
          <Item position={i + 1}>{totalPoints} pts</Item>
        </React.Fragment>
      ))}
    </TableContainer>
  </Container>
);

const Container = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 650px;
  margin-bottom: 4em;
`;

const TableContainer = styled.div`
  height: fit-content;
  display: grid;
  grid-template-columns: 3em 1em 1fr 5em;
  grid-auto-rows: 2.5em;
  justify-content: center;
  align-items: center;
  background-color: ${colours.blackblue400opacity50};
  border-radius: 0.2em;
  font-size: 1.5rem;
`;

const Item = styled.div<{ position: number }>`
  padding: 0.7em;
  font-size: ${({ position }) => {
    if (position === 1) return "100%";
    if (position === 2) return "90%";
    if (position === 3) return "80%";
    return "70%";
  }};
`;

export default LeagueTable;
