import React from "react";
import styled from "styled-components";

import colours from "../../../styles/colours";
import pageSizes from "../../../styles/pageSizes";
import { positionify } from "../../../utils";
import { UserTotalPoints } from "../../../types";

export interface Props {
  users: UserTotalPoints[];
}

const LeagueTable = ({ users }: Props) => (
  <Container>
    {users.map(({ userId, username, totalPoints }, i) => (
      <React.Fragment key={userId}>
        <Item position={i + 1}>{positionify(i + 1)}</Item>
        <Item position={i + 1}>|</Item>
        <Item position={i + 1}>{username}</Item>
        <Item position={i + 1}>{totalPoints} pts</Item>
      </React.Fragment>
    ))}
  </Container>
);

const Container = styled.div`
  max-width: 600px;
  font-size: 24px;
  display: grid;
  grid-template-columns: 3em 1em 1fr 5em;
  grid-auto-rows: 2.6em;
  background-color: ${colours.whiteOpacity04};
  border-radius: 5px;

  @media (max-width: ${pageSizes.tablet}) {
    font-size: 20px;
  }

  @media (max-width: ${pageSizes.mobileM}) {
    font-size: 18px;
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
