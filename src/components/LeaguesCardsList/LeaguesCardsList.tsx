import React from "react";
import styled from "styled-components";
import { useRouter } from "next/router";

import UserLeague from "src/types/UserLeague";
import pageSizes from "src/styles/pageSizes";
import colours from "src/styles/colours";
import Heading from "src/components/Heading";
import { positionify } from "utils/positionify";

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
          users,
          position,
          weeksToGo,
          weeksUntilStart,
        }) => {
          const numUsers = users?.length as number;
          const displayPosition = position ? positionify(position) : null;
          const isPositionRelevant = displayPosition && !weeksUntilStart;

          return (
            <LeagueCard
              tabIndex={0}
              key={id}
              onClick={() => router.push(`/league/${id}`)}
            >
              <LeagueCardHeading level="h2" variant="secondary">
                {name}
              </LeagueCardHeading>
              {isPositionRelevant &&
                (weeksToGo ? (
                  <p>
                    Current position: <BoldText>{displayPosition}</BoldText> of{" "}
                    <BoldText>{numUsers}</BoldText>
                  </p>
                ) : (
                  <p>
                    You finished: <BoldText>{displayPosition}</BoldText> of{" "}
                    <BoldText>{numUsers}</BoldText>
                  </p>
                ))}
              {weeksUntilStart ? (
                <p>
                  League starts in <BoldText>{weeksUntilStart}</BoldText>{" "}
                  gameweek{weeksUntilStart === 1 ? "" : "s"}!
                </p>
              ) : weeksToGo ? (
                <p>
                  Weeks remaining: <BoldText>{weeksToGo}</BoldText>
                </p>
              ) : null}
            </LeagueCard>
          );
        }
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
  font-weight: 400;
  margin: 0;
`;

const BoldText = styled.span`
  font-size: 1.2rem;
  font-weight: 700;
`;

export default LeaguesCardsList;
