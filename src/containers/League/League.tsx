import React, { useState } from "react";
import styled from "styled-components";
import { useQuery } from "@apollo/client";
import Link from "next/link";

import { LEAGUE_DETAILS } from "apollo/queries";
import WeeklyScoresTable from "@/components/organisms/WeeklyScoresTable";
import LeagueTable from "@/components/organisms/LeagueTable";
import Heading from "@/components/atoms/Heading";
import Loading from "@/components/atoms/Loading";
import { UserTotalPoints, WeeklyPoints } from "@/types";
import colours from "../../styles/colours";

interface Props {
  leagueId: number;
  isLeagueAdmin: boolean;
  fixtureWeeksAvailable: number[];
}

const LeagueContainer = ({
  leagueId,
  isLeagueAdmin,
  fixtureWeeksAvailable,
}: Props) => {
  const [users, setUsers] = useState<UserTotalPoints[]>();
  const [pointsByWeek, setPointsByWeek] = useState<WeeklyPoints[]>();
  const { data, loading, error } = useQuery(LEAGUE_DETAILS, {
    variables: { input: { leagueId } },
    onCompleted: ({ leagueDetails }) => {
      setUsers(leagueDetails.users);
      setPointsByWeek(leagueDetails.pointsByWeek);
    },
  });

  if (loading || !users || !pointsByWeek) return <Loading />;
  if (error) return <div>An error has occurred. Please try again later.</div>;

  const usersByTotalScore = users
    .slice()
    .sort((a, b) => b.totalPoints - a.totalPoints);

  return (
    <>
      <Heading level="h1">{data.leagueDetails.leagueName}</Heading>
      <Container>
        {isLeagueAdmin && (
          <Link href={`/league/${leagueId}/admin`}>
            <AdminLink>Admin</AdminLink>
          </Link>
        )}
        <LeagueTable users={usersByTotalScore} />
        <WeeklyScoresTable
          users={users}
          pointsByWeek={pointsByWeek}
          leagueId={leagueId}
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
