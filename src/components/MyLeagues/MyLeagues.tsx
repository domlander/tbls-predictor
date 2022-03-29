import React from "react";
import styled from "styled-components";
import Link from "next/link";
import { useRouter } from "next/router";

import UserLeague from "src/types/UserLeague";
import pageSizes from "src/styles/pageSizes";
import colours from "src/styles/colours";
import Heading from "src/components/Heading";

export interface Props {
  leagues: UserLeague[];
}

const MyLeagues = ({ leagues }: Props) => {
  const router = useRouter();
  if (!leagues?.length)
    return (
      <NoLeagues>
        <Link href="/league/join">
          <a>Join a league</a>
        </Link>
      </NoLeagues>
    );

  return (
    <Container>
      <Heading level="h2" variant="secondary">
        My Leagues
      </Heading>
      <LeagueCards>
        {leagues.map(
          ({
            leagueId: id,
            leagueName: name,
            position,
            weeksToGo,
            weeksUntilStart,
          }) => (
            <LeagueCard
              tabIndex={0}
              key={id}
              onClick={() => router.push(`/league/${id}`)}
            >
              <LeagueCardHeading level="h2" variant="secondary">
                {name}
              </LeagueCardHeading>
              <p>
                Current position:{" "}
                <span style={{ fontSize: "1.2rem", fontWeight: 700 }}>
                  {position || "Unknown"}
                </span>
              </p>
              {weeksUntilStart ? (
                <p>
                  League starts in{" "}
                  <span style={{ fontSize: "1.2rem", fontWeight: 700 }}>
                    {weeksUntilStart}
                  </span>{" "}
                  weeks
                </p>
              ) : weeksToGo ? (
                <p>
                  Weeks remaining:{" "}
                  <span style={{ fontSize: "1.2rem", fontWeight: 700 }}>
                    {weeksToGo}
                  </span>
                </p>
              ) : (
                <p>League finished!</p>
              )}
            </LeagueCard>
          )
        )}
      </LeagueCards>
    </Container>
  );
};

const Container = styled.section`
  display: flex;
  flex-direction: column;
  gap: 2em;
`;

const NoLeagues = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 2.5em;
  margin-bottom: 2em;

  p {
    margin: 0;
  }

  a {
    margin-left: 0.1em;
    text-decoration: underline;
    text-underline-offset: 2px;

    :hover,
    :focus {
      color: ${colours.cyan100};
    }
  }
`;

const LeagueCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 400px);
  grid-gap: 3em;

  @media (max-width: ${pageSizes.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const LeagueCard = styled.div`
  border: 1px solid ${colours.grey300};
  background-color: ${colours.blackblue400};
  padding: 3em 3em 2em;
  cursor: pointer;

  :hover,
  :focus {
    background-color: #ffffff10;
  }

  p {
    font-size: 1rem;
    margin-top: 1em;

    &:first-child {
      font-size: 1.2rem;
    }

    &:first-of-type {
      margin-top: 2em;
    }
  }
`;

const LeagueCardHeading = styled(Heading)`
  margin: 0;
`;

export default MyLeagues;
