import React, { useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import { useQuery } from "@apollo/client";

import { LEAGUE_WEEK } from "apollo/queries";
import Heading from "@/components/atoms/Heading";
import Loading from "@/components/atoms/Loading";
import WeekNavigator from "@/components/molecules/WeekNavigator";
import LeagueWeekUserTotals from "@/components/molecules/LeagueWeekUserTotals";
import LeagueWeekFixtures from "@/components/organisms/LeagueWeekFixtures";
import { FixtureWithUsersPredictions, UserTotalPointsWeek } from "@/types";

interface Props {
  leagueId: number;
  weekId: number;
}

const LeagueContainer = ({ leagueId, weekId }: Props) => {
  const [users, setUsers] = useState<UserTotalPointsWeek[]>();
  const [fixtures, setFixtures] = useState<FixtureWithUsersPredictions[]>();
  const { data, loading, error } = useQuery(LEAGUE_WEEK, {
    variables: { input: { leagueId, weekId } },
    onCompleted: ({ leagueWeek }) => {
      setUsers(leagueWeek.users);
      setFixtures(leagueWeek.fixtures);
    },
  });

  if (loading || !users || !fixtures) return <Loading />;
  if (error) return <div>An error has occurred. Please try again later.</div>;

  const thisWeeksFixtures = fixtures.filter(
    (fixture) => fixture.gameweek === weekId
  );

  const { leagueName, firstGameweek, lastGameweek } = data.leagueWeek;

  return (
    <Container>
      <Link href={`/league/${leagueId}`}>
        <a>
          <LeagueName level="h3">{leagueName}</LeagueName>
        </a>
      </Link>
      <WeekNavigator
        week={weekId}
        prevGameweekUrl={
          weekId === firstGameweek ? undefined : `/league/9/week/${weekId - 1}`
        }
        nextGameweekUrl={
          weekId === lastGameweek ? undefined : `/league/9/week/${weekId + 1}`
        }
      />
      <LeagueWeekUserTotals users={users} />
      <LeagueWeekFixtures weekId={weekId} fixtures={thisWeeksFixtures} />
    </Container>
  );
};

const LeagueName = styled(Heading)`
  margin-bottom: 0;
`;

const Container = styled.div`
  margin: 0 16px 16px;
  display: flex;
  flex-direction: column;
`;

export default LeagueContainer;
