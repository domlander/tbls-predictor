import Link from "next/link";
import Image from "next/image";
import styled from "styled-components";

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

const LeagueWeekContainer = ({
  leagueId,
  leagueName,
  weekId: gameweek,
  users,
  fixtures,
  firstGameweek,
  lastGameweek,
}: Props) => {
  const usersGameweekPoints: UserPoints[] = users.map(
    ({ id, username, weekPoints }: User) => ({
      id,
      username: username || "unknown",
      points: weekPoints || 0,
    })
  );

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
          {!fixtures?.length ? (
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
            <LeagueWeekFixtures weekId={gameweek} fixtures={sortedFixtures} />
          )}
        </section>
      </>
    </Container>
  );
};

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

    &:hover,
    &:focus {
      color: ${colours.cyan100};
    }
  }
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
