import React from "react";
import styled from "styled-components";
import Link from "next/link";

import WeeklyScoresTable from "@/components/organisms/WeeklyScoresTable";
import LeagueTable from "@/components/organisms/LeagueTable";
import Heading from "@/components/atoms/Heading";
import { UserTotalPoints, WeeklyPoints } from "@/types";
import { useSession } from "next-auth/client";
import colours from "../../styles/colours";

interface Props {
  id: number;
  name: string;
  administratorId: number;
  users: UserTotalPoints[];
  pointsByWeek: WeeklyPoints[];
  fixtureWeeksAvailable: number[];
}

const LeagueContainer = ({
  id,
  name,
  administratorId,
  users,
  pointsByWeek,
  fixtureWeeksAvailable,
}: Props) => {
  const [session] = useSession();

  const usersByTotalScore = users
    .slice()
    .sort((a, b) => b.totalPoints - a.totalPoints);

  return (
    <>
      <Heading level="h1">{name}</Heading>
      <Container>
        {session?.user?.id && session.user.id === administratorId && (
          <Link href={`/league/${id}/admin`}>
            <AdminLink>Admin</AdminLink>
          </Link>
        )}
        <LeagueTable users={usersByTotalScore} />
        <WeeklyScoresTable
          users={users}
          pointsByWeek={pointsByWeek}
          leagueId={id}
          fixtureWeeksAvailable={fixtureWeeksAvailable}
        />
      </Container>
    </>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 2.4em;

  @media (max-width: 600px) {
    margin: 0;
  }
`;

const AdminLink = styled.a`
  font-size: 1rem;
  text-decoration: underline;
  cursor: pointer;
  text-underline-offset: 0.2em;

  :hover,
  :focus {
    color: ${colours.blue100};
  }
`;

export default LeagueContainer;
