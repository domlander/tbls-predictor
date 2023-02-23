import React, { useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@apollo/client";

import refresh from "public/images/refresh.svg";
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
import dayjs, { Dayjs } from "dayjs";
import isToday from "dayjs/plugin/isToday";

dayjs.extend(isToday);

interface Props {
  leagueId: number;
  leagueName: string;
  weekId: number;
  users: User[];
  fixtures: Fixture[];
  firstGameweek: number;
  lastGameweek: number;
}

const formatDate = (lastUpdated: Dayjs) => {
  if (dayjs(lastUpdated).isToday()) {
    return dayjs(lastUpdated).format("h:mma"); // 7:08am
  }

  return dayjs(lastUpdated).format("ddd D MMM h:mma"); // Sun 14 Jan 7:08am
};

const LeagueWeekContainer = ({
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
  const [lastUpdated, setLastUpdated] = useState<Dayjs | null>(null);

  const { loading, refetch } = useQuery(LEAGUE_WEEK_QUERY, {
    variables: {
      leagueId,
      weekId: gameweek,
    },
    notifyOnNetworkStatusChange: true,
    pollInterval: 3000, // ms
    onCompleted: (data) => {
      if (data?.fixturesWithPredictions?.fixtures) {
        setFixtures(data.fixturesWithPredictions.fixtures);
      }
      if (data?.league?.users) {
        setUsers(data?.league?.users);
      }
      setLastUpdated(dayjs());
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
        <Breadcrumbs aria-label="breadcrumbs">
          <ul>
            <li>
              <Link href={`/league/${leagueId}`} passHref>
                {leagueName}
              </Link>
            </li>
            <li>
              <p>{`Gameweek ${gameweek}`}</p>
            </li>
          </ul>
        </Breadcrumbs>
        {!loading ? (
          <RefreshButton type="button" onClick={() => refetch()}>
            <Image src={refresh} height="20" alt="Refresh scores icon" />
          </RefreshButton>
        ) : null}
      </TopBar>
      <>
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
        <section>
          <LeagueWeekUserTotals users={usersGameweekPoints} />
          {loading && !fixtures?.length ? (
            <Loading>
              <p>Loading...</p>
              <div>
                <Image
                  src="/images/spinner.gif"
                  height="40"
                  width="40"
                  alt=""
                />
              </div>
            </Loading>
          ) : (
            <>
              <LeagueWeekFixtures weekId={gameweek} fixtures={sortedFixtures} />
              {lastUpdated && (
                <LastUpdated>
                  <p>{`Last updated: ${formatDate(lastUpdated)}`}</p>
                </LastUpdated>
              )}
            </>
          )}
        </section>
      </>
    </Container>
  );
};

const LastUpdated = styled.div`
  display: flex;
  justify-content: end;

  p {
    font-size: 0.6rem;
    @media (min-width: ${pageSizes.mobileL}) {
      font-size: 0.8rem;
    }

    color: ${colours.grey500};
    font-style: italic;
  }
`;

const Container = styled.div`
  max-width: ${pageSizes.tablet};
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0.8em 0;
`;

const Breadcrumbs = styled.nav`
  height: 1.875em;
  font-size: 0.8rem;
  color: ${colours.grey300};

  ul {
    padding: 0;
    display: flex;
    gap: 0.8em;
  }

  li:not(:first-child) {
    display: flex;

    &:before {
      content: "|";
      width: 0.8em;
    }
  }

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
    text-underline-offset: 2px;

    :hover,
    :focus {
      color: ${colours.cyan100};
    }
  }
`;

const RefreshButton = styled.button`
  cursor: pointer;
`;

const Loading = styled.section`
  display: flex;
  align-items: center;
  gap: 2em;

  p {
    font-size: 2rem;
  }

  div {
    height: 50px;
    width: 50px;
  }
`;

export default LeagueWeekContainer;
