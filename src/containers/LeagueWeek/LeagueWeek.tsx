import React from "react";
import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";

import WeekNavigator from "@/components/molecules/WeekNavigator";
import LeagueWeekUserTotals from "@/components/molecules/LeagueWeekUserTotals";
import LeagueWeekFixtures from "@/components/organisms/LeagueWeekFixtures";
import { FixtureWithUsersPredictions, UserTotalPointsWeek } from "@/types";
import colours from "@/styles/colours";
import pageSizes from "@/styles/pageSizes";

interface Props {
  leagueId: number;
  leagueName: string;
  weekId: number;
  users: UserTotalPointsWeek[];
  fixtures: FixtureWithUsersPredictions[];
  firstGameweek: number;
  lastGameweek: number;
}

const LeagueContainer = ({
  leagueId,
  leagueName,
  weekId,
  users,
  fixtures,
  firstGameweek,
  lastGameweek,
}: Props) => {
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
      <LeagueWeekFixtures weekId={weekId} fixtures={fixtures} />
    </Container>
  );
};

const LeagueName = styled.div`
  margin-left: 0.5em;
  font-size: 1.2rem;
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
  margin: 0 auto 4em;
  display: flex;
  flex-direction: column;
`;

export default LeagueContainer;
