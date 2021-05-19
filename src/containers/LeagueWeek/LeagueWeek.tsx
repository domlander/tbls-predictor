import React, { useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@apollo/client";

import { LEAGUE_WEEK } from "apollo/queries";
import Loading from "@/components/atoms/Loading";
import WeekNavigator from "@/components/molecules/WeekNavigator";
import LeagueWeekUserTotals from "@/components/molecules/LeagueWeekUserTotals";
import LeagueWeekFixtures from "@/components/organisms/LeagueWeekFixtures";
import { FixtureWithUsersPredictions, UserTotalPointsWeek } from "@/types";
import colours from "@/styles/colours";
import pageSizes from "@/styles/pageSizes";

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
      <Link href={`/league/${leagueId}`} passHref>
        <A>
          <Image
            src="/images/ArrowBack.svg"
            alt="Go back to league page"
            width="30"
            height="44"
          />
          <LeagueName>{leagueName}</LeagueName>
        </A>
      </Link>
      <WeekNavigator
        week={weekId}
        prevGameweekUrl={
          weekId === firstGameweek
            ? undefined
            : `/league/${leagueId}/week/${weekId - 1}`
        }
        nextGameweekUrl={
          weekId === lastGameweek
            ? undefined
            : `/league/${leagueId}/week/${weekId + 1}`
        }
      />
      <LeagueWeekUserTotals users={users} />
      <LeagueWeekFixtures weekId={weekId} fixtures={thisWeeksFixtures} />
    </Container>
  );
};

const LeagueName = styled.div`
  margin-left: 10px;
  font-size: 18px;
  font-style: italic;
`;

const A = styled.a`
  display: flex;
  align-items: center;
  cursor: pointer;

  > * {
    :hover,
    :focus {
      color: ${colours.blue100};
      text-decoration: underline;
    }
  }
`;

const Container = styled.div`
  max-width: ${pageSizes.tablet};
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`;

export default LeagueContainer;
