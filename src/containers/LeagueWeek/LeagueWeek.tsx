import React, { useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@apollo/client";

import { LEAGUE_WEEK_QUERY } from "apollo/queries";
import { UserPoints } from "src/types/UserPoints";
import { Fixture } from "src/types/Fixture";
import { User } from "src/types/User";
import sortFixtures from "utils/sortFixtures";
import WeekNavigator from "@/components/molecules/WeekNavigator";
import LeagueWeekUserTotals from "@/components/molecules/LeagueWeekUserTotals";
import LeagueWeekFixtures from "@/components/organisms/LeagueWeekFixtures";
import colours from "@/styles/colours";
import pageSizes from "@/styles/pageSizes";

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
  weekId,
  users: usersFromProps,
  fixtures: fixturesFromProps,
  firstGameweek,
  lastGameweek,
}: Props) => {
  const [fixtures, setFixtures] = useState(fixturesFromProps);
  const [users, setUsers] = useState(usersFromProps);

  const { loading } = useQuery(LEAGUE_WEEK_QUERY, {
    variables: { leagueId, weekId },
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
      points: weeklyPoints?.find(({ week }) => week === weekId)?.points || 0,
    }))
    .sort((a, b) => b.points - a.points || a.userId - b.userId);

  const sortedFixtures = sortFixtures(fixtures);

  return (
    <Container>
      <TopBar>
        <Link href={`/league/${leagueId}`} passHref>
          <A>
            <Image
              src="/images/ArrowBack.svg"
              alt="Go back to league page"
              width="30"
              height="44"
            />
            <LeagueNameContainer>{leagueName}</LeagueNameContainer>
          </A>
        </Link>
        {loading ? (
          <SpinnerContainer>
            <Image src="/images/spinner.gif" height="12" width="12" alt="" />
          </SpinnerContainer>
        ) : null}
      </TopBar>
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
      <LeagueWeekUserTotals users={usersGameweekPoints} />
      <LeagueWeekFixtures weekId={weekId} fixtures={sortedFixtures} />
    </Container>
  );
};

const Container = styled.div`
  max-width: ${pageSizes.tablet};
  margin: 0 auto 4em;
  display: flex;
  flex-direction: column;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
`;

const A = styled.a`
  display: flex;
  align-items: center;
  cursor: pointer;

  > * {
    :hover,
    :focus {
      color: ${colours.cyan100};
      text-decoration: underline;
    }
  }
`;

const LeagueNameContainer = styled.div`
  margin-left: 0.5em;
  font-size: 1.2rem;
  font-style: italic;
`;

const SpinnerContainer = styled.div`
  height: 12px;
  width: 12px;
  margin-top: 8px;
`;

export default LeagueContainer;
