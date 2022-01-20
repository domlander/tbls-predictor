import React from "react";
import styled from "styled-components";
import Link from "next/link";

import { User } from "src/types/NewTypes";
import pageSizes from "../../../styles/pageSizes";
import colours from "../../../styles/colours";
import Heading from "../../../components/atoms/Heading";

export interface Props {
  leagueName: string;
  users: User[];
  leagueId: number;
  fixtureWeeksAvailable: number[];
}

const WeeklyScoresTable = ({
  leagueName,
  users,
  leagueId,
  fixtureWeeksAvailable,
}: Props) => {
  return (
    <Container>
      <ScoresHeading level="h2">{leagueName}</ScoresHeading>
      <Table>
        <ParticipantsAndTotalPoints numParticipants={users.length}>
          <BlankHeaderItem />
          {users.map(({ id, username, totalPoints }) => (
            <React.Fragment key={id}>
              <Participant>{username}</Participant>
              <TotalPoints>{totalPoints}</TotalPoints>
            </React.Fragment>
          ))}
        </ParticipantsAndTotalPoints>
        <AllPointsWrapper>
          <AllPoints
            numWeeks={fixtureWeeksAvailable.length}
            numParticipants={users.length}
          >
            <BlankTableHeaderItem />
            {fixtureWeeksAvailable.map((week) => (
              <HeaderItem key={week}>
                {fixtureWeeksAvailable.indexOf(week) !== -1 ? (
                  <Link href={`/league/${leagueId}/week/${week}`}>
                    <ClickableRowHeading>{week}</ClickableRowHeading>
                  </Link>
                ) : (
                  <RowHeading>{`Week ${week}`}</RowHeading>
                )}
              </HeaderItem>
            ))}
            {users.map(({ id, weeklyPoints }) => (
              <React.Fragment key={id}>
                {weeklyPoints?.map(({ week, points }, i) => (
                  <React.Fragment key={`${id}${week}`}>
                    {i === 0 && <BlankTableItem />}
                    <WeeklyPoints rowIndex={i} key={week}>
                      {points}
                    </WeeklyPoints>
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
          </AllPoints>
        </AllPointsWrapper>
      </Table>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 4em;

  @media (max-width: ${pageSizes.tablet}) {
    margin-top: 2.5em;
  }
`;

const ScoresHeading = styled(Heading)`
  color: ${colours.cyan500};
  font-weight: 700;
  margin: 1em 0;
`;

const Table = styled.div`
  display: flex;
  font-size: 1.5rem;
  max-width: calc(100vw - 2em);

  @media (max-width: ${pageSizes.tablet}) {
    font-size: 1rem;
  }
`;

const ParticipantsAndTotalPoints = styled.div<{ numParticipants: number }>`
  display: grid;
  grid-template-columns: 1fr 4em;
  grid-template-rows: ${({ numParticipants }) =>
    `82px repeat(${numParticipants}, 72px)`};
  color: ${colours.grey300};

  @media (max-width: ${pageSizes.tablet}) {
    grid-template-columns: 1fr 3.4em;
    grid-template-rows: ${({ numParticipants }) =>
      `52px repeat(${numParticipants}, 50px)`};
  }

  > div {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const AllPointsWrapper = styled.div`
  transform: rotateX(180deg);
  -webkit-transform: rotateX(180deg); /* Safari and Chrome */
  overflow-x: scroll;
  border-left: 1px solid ${colours.grey500opacity50};
  border-bottom: 1px solid ${colours.grey500opacity50}; /* equiv to border-top without the transform */
  padding-bottom: 8px; /* equiv to padding-top without the transform */

  @media (max-width: ${pageSizes.tablet}) {
    padding-bottom: 6px; /* equiv to padding-top without the transform */
  }

  ::-webkit-scrollbar {
    height: 12px;

    @media (max-width: ${pageSizes.tablet}) {
      height: 8px;
    }
  }

  ::-webkit-scrollbar-thumb {
    /* Foreground */
    background: ${colours.cyan600};
  }
  ::-webkit-scrollbar-track {
    /* Background */
    background: none;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 1em;
  }
`;

const AllPoints = styled.div<{ numWeeks: number; numParticipants: number }>`
  display: grid;
  grid-template-columns: ${({ numWeeks }) => `20px repeat(${numWeeks}, 70px)`};
  grid-template-rows: ${({ numParticipants }) =>
    `61px repeat(${numParticipants}, 72px)`};
  color: ${colours.grey300};
  transform: rotateX(180deg);
  -webkit-transform: rotateX(180deg);

  @media (max-width: ${pageSizes.tablet}) {
    grid-template-columns: ${({ numWeeks }) =>
      `12px repeat(${numWeeks}, 32px)`};
    grid-template-rows: ${({ numParticipants }) =>
      `37px repeat(${numParticipants}, 50px)`};
  }

  > div {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const HeaderItem = styled.div`
  max-width: 100%;
  border-bottom: 1px solid ${colours.grey500opacity50};
  align-items: flex-start !important;
`;

const BlankHeaderItem = styled(HeaderItem)`
  grid-column: span 2 / span 2;
  border: none;
  border-bottom: 1px solid ${colours.grey500opacity50};
`;

const BlankTableItem = styled.div``;

const BlankTableHeaderItem = styled.div`
  border-bottom: 1px solid ${colours.grey500opacity50};
`;

const RowHeading = styled.div``;

const ClickableRowHeading = styled.a`
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 0.2em;
  text-decoration-thickness: 0.05em;

  :hover,
  :focus {
    color: ${colours.cyan100};
    text-decoration: underline;
  }
`;

const Participant = styled.div`
  justify-self: flex-start;
  margin: 0 1em;
  font-size: 1.6rem;

  @media (max-width: ${pageSizes.tablet}) {
    font-size: 1rem;
    margin: 0 0.4em;
  }
`;

const TotalPoints = styled.div`
  color: ${colours.white};
  border-left: 1px solid ${colours.grey500opacity50};
  font-size: 2rem;

  @media (max-width: ${pageSizes.tablet}) {
    font-size: 1.5rem;
  }
`;

const WeeklyPoints = styled.div<{ rowIndex: number }>``;

export default WeeklyScoresTable;
