"use client";

import styled from "styled-components";
import Link from "next/link";
import { useSession } from "next-auth/react";

import User from "src/types/User";
import WeeklyScoresTable from "src/components/WeeklyScoresTable";
import colours from "src/styles/colours";

interface Props {
  id: number;
  name: string;
  gameweekStart: number;
  gameweekEnd: number;
  administratorId: string;
  users: User[];
  fixtureWeeksAvailable: number[] | null;
}

const LeagueContainer = ({
  id,
  name,
  gameweekStart,
  gameweekEnd,
  administratorId,
  users,
  fixtureWeeksAvailable,
}: Props) => {
  const { data: session } = useSession();

  return (
    <>
      <Container>
        {session?.user?.id === administratorId && (
          <AdminLink href={`/league/${id}/admin`}>Admin</AdminLink>
        )}
        <WeeklyScoresTable
          leagueName={name}
          users={users}
          leagueId={id}
          gameweekStart={gameweekStart}
          fixtureWeeksAvailable={fixtureWeeksAvailable}
        />
        <FinalWeekText>
          The league runs until gameweek {gameweekEnd}
        </FinalWeekText>
      </Container>
    </>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;

  @media (max-width: 600px) {
    margin: 0;
  }
`;

const FinalWeekText = styled.p`
  font-size: 0.9rem;
  margin-top: 2em;
`;

const AdminLink = styled(Link)`
  font-size: 1rem;
  text-decoration: underline;
  cursor: pointer;
  text-underline-offset: 2px;
  margin-top: 1em;

  &:hover,
  &:focus {
    color: ${colours.cyan100};
  }

  @media (max-width: 600px) {
    font-size: 0.8rem;
  }
`;

export default LeagueContainer;
