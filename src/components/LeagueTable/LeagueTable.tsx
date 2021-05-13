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
    {users.map(({ userId, username, totalPoints }, i) => (
      <React.Fragment key={userId}>
        <div>{positionify(i + 1)}</div>
        <div>{username}</div>
        <div>{totalPoints}</div>
      </React.Fragment>
    ))}
  </Container>
);

const Container = styled.div`
  margin: 0 auto;
  max-width: 380px;
  width: max(75%, 280px);
  font-size: 14px;
  display: grid;
  grid-template-columns: 3em 1fr 4em;
  grid-auto-rows: 3em;
  background: ${colours.blackblue500};
  border-bottom: 1px solid ${colours.grey500};
  border-right: 1px solid ${colours.grey500};

  > div {
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 1px solid ${colours.grey500};
    border-left: 1px solid ${colours.grey500};
  }
`;

export default LeagueTable;
