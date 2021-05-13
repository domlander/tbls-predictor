import React, { useState } from "react";
import styled from "styled-components";

import WeeklyScoresTable from "@/components/WeeklyScoresTable";
import LeagueTable from "@/components/LeagueTable";
import Heading from "@/components/atoms/Heading";
import { LEAGUE_DETAILS } from "apollo/queries";
import Loading from "@/components/atoms/Loading";
import { useQuery } from "@apollo/client";
import { UserTotalPoints, WeeklyPoints } from "@/types";

interface Props {
  leagueId: number;
}

const LeagueContainer = ({ leagueId }: Props) => {
  const [users, setUsers] = useState<UserTotalPoints[]>();
  const [pointsByWeek, setPointsByWeek] = useState<WeeklyPoints[]>();
  const { data, loading, error } = useQuery(LEAGUE_DETAILS, {
    variables: { input: { leagueId } },
    onCompleted: ({ leagueDetails }) => {
      setUsers(leagueDetails.users);
      setPointsByWeek(leagueDetails.pointsByWeek);
    },
  });

  if (loading) return <Loading />;
  if (error || !users || !pointsByWeek)
    return <div>An error has occurred. Please try again later.</div>;

  return (
    <Container>
      <Heading level="h1">{data.leagueDetails.leagueName}</Heading>
      <LeagueTable users={users} />
      <WeeklyScoresTable
        users={users}
        pointsByWeek={pointsByWeek}
        leagueId={leagueId}
      />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export default LeagueContainer;
