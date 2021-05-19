import React, { useState } from "react";
import styled from "styled-components";
import { useQuery } from "@apollo/client";

import { LEAGUE_DETAILS } from "apollo/queries";
import WeeklyScoresTable from "@/components/organisms/WeeklyScoresTable";
import LeagueTable from "@/components/organisms/LeagueTable";
import Heading from "@/components/atoms/Heading";
import Loading from "@/components/atoms/Loading";
import { UserTotalPoints, WeeklyPoints } from "@/types";
import pageSizes from "@/styles/pageSizes";

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

  if (loading || !users || !pointsByWeek) return <Loading />;
  if (error) return <div>An error has occurred. Please try again later.</div>;

  return (
    <>
      <LeagueName level="h1">{data.leagueDetails.leagueName}</LeagueName>
      <Container>
        <LeagueTable users={users} />
        <WeeklyScoresTable
          users={users}
          pointsByWeek={pointsByWeek}
          leagueId={leagueId}
        />
      </Container>
    </>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 24px;

  @media (max-width: 600px) {
    margin: 0;
  }
`;

const LeagueName = styled(Heading)`
  @media (max-width: ${pageSizes.mobileL}) {
    font-size: 40px;
  }
`;

export default LeagueContainer;
