import React, { useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@apollo/client";

import { LEAGUE_WEEK_QUERY } from "apollo/queries";
import UserPoints from "src/types/UserPoints";
import Fixture from "src/types/Fixture";
import User from "src/types/User";
import sortFixtures from "utils/sortFixtures";
import WeekNavigator from "src/components/WeekNavigator";
import LeagueWeekUserTotals from "src/components/LeagueWeekUserTotals";
import LeagueWeekFixtures from "src/components/LeagueWeekFixtures";
import pageSizes from "src/styles/pageSizes";
import colours from "src/styles/colours";

interface Props {
  leagueId: number;
  leagueName: string;
  weekId: number;
  users: User[];
  fixtures: Fixture[];
  firstGameweek: number;
  lastGameweek: number;
}

const LeagueContainer = ({
  leagueId,
  leagueName,
  weekId: gameweek,
  users: usersFromProps,
  fixtures: fixturesFromProps,
  firstGameweek,
  lastGameweek,
}: Props) => {
  const [fixtures, setFixtures] = useState(fixturesFromProps);
  const [users, setUsers] = useState(usersFromProps);

  const { loading } = useQuery(LEAGUE_WEEK_QUERY, {
    variables: { leagueId, weekId: gameweek },
    onCompleted: (data) => {
      if (data?.fixturesWithPredictions?.fixtures) {
        setFixtures(data.fixturesWithPredictions.fixtures);
      }
      if (data?.league?.users) {
        setUsers(data?.league?.users);
      }
    },
  });

  const usersGameweekPoints: UserPoints[] = users
    .map(({ id: userId, username, weeklyPoints }: User) => ({
      userId,
      username,
      points: weeklyPoints?.find(({ week }) => week === gameweek)?.points || 0,
    }))
    .sort((a, b) => b.points - a.points || (b.userId > a.userId ? 1 : -1));

  const sortedFixtures = sortFixtures(fixtures);

  return (
    <Container>
      <TopBar>
        <Breadcrumbs>
          <Link href={`/league/${leagueId}`} passHref>
            <A>{leagueName}</A>
          </Link>
          <span>|</span>
          <p>{`Gameweek ${gameweek}`}</p>
        </Breadcrumbs>
        {loading ? (
          <SpinnerContainer>
            <Image src="/images/spinner.gif" height="12" width="12" alt="" />
          </SpinnerContainer>
        ) : null}
      </TopBar>
      <WeekNavigator
        week={gameweek}
        prevGameweekUrl={
          gameweek === firstGameweek
            ? undefined
            : `/league/${leagueId}/week/${gameweek - 1}`
        }
        nextGameweekUrl={
          gameweek === lastGameweek
            ? undefined
            : `/league/${leagueId}/week/${gameweek + 1}`
        }
      />
      <Table>
        <LeagueWeekUserTotals users={usersGameweekPoints} />
        <LeagueWeekFixtures weekId={gameweek} fixtures={sortedFixtures} />
      </Table>
    </Container>
  );
};

const Table = styled.div`
  display: contents;
`;

const Container = styled.div`
  max-width: ${pageSizes.tablet};
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`;

const TopBar = styled.section`
  display: flex;
  justify-content: space-between;
  margin: 0.8em 0;
`;

const Breadcrumbs = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  font-size: 0.8rem;
  color: ${colours.grey300};

  p {
    margin: 0;
  }

  span {
    margin: 0 0.5em;
  }

  a {
    display: flex;
    align-items: center;
    cursor: pointer;
    text-decoration: underline;
    text-underline-offset: 1px;

    :hover,
    :focus {
      color: ${colours.cyan100};
    }
  }
`;

const A = styled.a``;

const SpinnerContainer = styled.div`
  height: 12px;
  width: 12px;
  margin-top: 8px;
`;

export default LeagueContainer;
