import React from "react";
import styled from "styled-components";
import Link from "next/link";
import { useSession } from "next-auth/react";

import User from "src/types/User";
import WeeklyScoresTable from "src/components/WeeklyScoresTable";
import colours from "src/styles/colours";

interface Props {
  id: number;
  name: string;
  administratorId: string;
  users: User[];
  fixtureWeeksAvailable: number[];
}

const LeagueContainer = ({
  id,
  name,
  administratorId,
  users,
  fixtureWeeksAvailable,
}: Props) => {
  const { data: session } = useSession();

  return (
    <>
      <Container>
        {session?.user?.id !== administratorId && (
          <Link href={`/league/${id}/admin`}>
            <AdminLink>Admin</AdminLink>
          </Link>
        )}
        <WeeklyScoresTable
          leagueName={name}
          users={users}
          leagueId={id}
          fixtureWeeksAvailable={fixtureWeeksAvailable}
        />
      </Container>
    </>
  );
};

const Container = styled.main`
  display: flex;
  flex-direction: column;

  @media (max-width: 600px) {
    margin: 0;
  }
`;

const AdminLink = styled.a`
  font-size: 1rem;
  text-decoration: underline;
  cursor: pointer;
  text-underline-offset: 2px;

  :hover,
  :focus {
    color: ${colours.cyan100};
  }
`;

export default LeagueContainer;
