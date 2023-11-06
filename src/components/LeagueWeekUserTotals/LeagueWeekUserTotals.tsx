import styled from "styled-components";

import UserPoints from "src/types/UserPoints";
import pageSizes from "src/styles/pageSizes";
import colours from "src/styles/colours";
import LeagueWeekUserScore from "../LeagueWeekUserScore";

export type Props = {
  users: UserPoints[];
};

const LeagueWeekUserTotals = ({ users }: Props) => {
  return (
    <Container $numUsers={users.length}>
      {users.map(({ id, username }) => (
        <Username key={id}>{username}</Username>
      ))}
      {users.map(({ id, points }) => (
        <LeagueWeekUserScore key={id} score={points} />
      ))}
    </Container>
  );
};

const Container = styled.div<{ $numUsers: number }>`
  width: 100%;
  margin-bottom: 1.5em;
  display: grid;
  grid-template-columns: ${({ $numUsers }) => `repeat(${$numUsers}, 1fr)`};
  justify-items: center;
  position: sticky;
  top: 0;
  background: ${colours.blackblue400};
  /* box-shadow: offset-x | offset-y | blur-radius | color */
  box-shadow: 0 10px 10px ${colours.blackblue400};
`;

const Username = styled.div`
  margin-top: 1.5em;
  text-align: center;
  font-size: 1.2rem;

  @media (max-width: ${pageSizes.tablet}) {
    font-size: 0.8rem;
  }
`;

export default LeagueWeekUserTotals;
