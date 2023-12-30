"use client";

import styled from "styled-components";
import Link from "next/link";

import UserLeague from "src/types/UserLeague";
import Heading from "src/components/Heading";
import { positionify } from "utils/positionify";

export interface Props {
  leagues: UserLeague[];
}

const LeaguesCardsList = ({ leagues }: Props) => {
  return (
    <Container>
      {leagues.map(
        ({
          leagueId: id,
          leagueName: name,
          weeksToGo,
          weeksUntilStart,
          position,
          numParticipants,
        }) => {
          const displayPosition = position ? positionify(position) : null;
          const isPositionRelevant = displayPosition && !weeksUntilStart;

          return (
            <LeagueCard key={id} tabIndex={0}>
              <Link href={`/league/${id}`} tabIndex={-1}>
                <LeagueCardHeading level="h2" variant="secondary">
                  {name}
                </LeagueCardHeading>
                {isPositionRelevant &&
                  (weeksToGo ? (
                    <p>
                      Current position:{" "}
                      <BigBoldText>{displayPosition}</BigBoldText> of{" "}
                      <BoldText>{numParticipants}</BoldText>
                    </p>
                  ) : (
                    <p>
                      You finished: <BoldText>{displayPosition}</BoldText> of{" "}
                      <BoldText>{numParticipants}</BoldText>
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
              </Link>
            </LeagueCard>
          );
        }
      )}
    </Container>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 3em;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-gap: 2em;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    grid-gap: 1em;
  }
`;

const LeagueCard = styled.div`
  max-width: 400px;
  border: 1px solid var(--grey300);
  background-color: var(--blackblue200);
  padding: 3em 3em 2em;
  cursor: pointer;

  &:hover,
  &:focus {
    background-color: #ffffff20;
    outline: 2px solid var(--grey300);
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

const BigBoldText = styled(BoldText)`
  font-size: 1.4rem;
`;

export default LeaguesCardsList;
