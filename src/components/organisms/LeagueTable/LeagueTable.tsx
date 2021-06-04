import React from "react";
import styled from "styled-components";

import { positionify } from "utils/positionify";
import Heading from "../../../components/atoms/Heading";
import colours from "../../../styles/colours";
import pageSizes from "../../../styles/pageSizes";
import { UserTotalPoints } from "../../../types";

export interface Props {
  users: UserTotalPoints[];
}

const LeagueTable = ({ users }: Props) => (
  <Container>
    <TableHeading level="h2">Table</TableHeading>
    <TableContainer>
      {users.map(({ userId, username, totalPoints }, i) => (
        <React.Fragment key={userId}>
          <Item position={i + 1}>{positionify(i + 1)}</Item>
          <Item position={i + 1}>|</Item>
          <Item position={i + 1}>{username}</Item>
          <Item position={i + 1}>{totalPoints} pts</Item>
        </React.Fragment>
      ))}
    </TableContainer>
  </Container>
);

const TableHeading = styled(Heading)`
  margin: 0.4em 0;
  @media (max-width: ${pageSizes.mobileL}) {
    font-size: 30px;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 650px;
  margin-bottom: 4em;
`;

const TableContainer = styled.div`
  height: fit-content;
  font-size: 26px;
  display: grid;
  grid-template-columns: 3em 1em 1fr 5em;
  grid-auto-rows: 2.6em;
  background-color: ${colours.whiteOpacity02};
  border-radius: 5px;
  padding-top: 8px;

  @media (max-width: ${pageSizes.tablet}) {
    font-size: 22px;
  }

  @media (max-width: ${pageSizes.mobileL}) {
    font-size: 20px;
  }
`;

const Item = styled.div<{ position: number }>`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 16px;
  font-size: ${({ position }) => {
    if (position === 1) return "100%";
    if (position === 2) return "90%";
    if (position === 3) return "80%";
    return "70%";
  }};
`;

export default LeagueTable;
