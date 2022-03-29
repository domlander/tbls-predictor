import React from "react";
import styled from "styled-components";
import { useRouter } from "next/router";

import UserLeague from "src/types/UserLeague";
import pageSizes from "src/styles/pageSizes";
import colours from "src/styles/colours";
import Heading from "src/components/Heading";

export interface Props {
  leagues: UserLeague[];
}

const LeaguesCardsList = ({ leagues }: Props) => {
  const router = useRouter();

  return (
    <Container>
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
    </Container>
  );
};

const Container = styled.div`
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

export default LeaguesCardsList;
