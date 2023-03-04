import React, { useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import { useSession } from "next-auth/react";

import User from "src/types/User";
import WeeklyScoresTable from "src/components/WeeklyScoresTable";
import colours from "src/styles/colours";
import Heading from "src/components/Heading";

interface Props {
  id: number;
  name: string;
  gameweekStart: number;
  gameweekEnd: number;
  administratorId: string;
  users: User[];
  fixtureWeeksAvailable: number[] | null;
}

type Tab = "standings" | "stats";

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
  const [activeTab, setActiveTab] = useState<Tab>("standings");

  return (
    <Container>
      {session?.user?.id === administratorId && (
        <AdminLink href={`/league/${id}/admin`}>Admin</AdminLink>
      )}
      <Heading level="h2" as="h1" variant="secondary">
        {name}
      </Heading>
      <Tabs>
        <ul>
          <li>Standings</li>
          <li>Stats</li>
        </ul>
      </Tabs>
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
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1em;

  @media (max-width: 600px) {
    margin: 0;
  }
`;

const Tabs = styled.div`
  margin-top: 4em;

  ul {
    display: flex;
    gap: 2em;
  }
  li {
    font-size: 1.5rem;
    font-weight: 200;
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

  :hover,
  :focus {
    color: ${colours.cyan100};
  }

  @media (max-width: 600px) {
    font-size: 0.8rem;
  }
`;

export default LeagueContainer;
