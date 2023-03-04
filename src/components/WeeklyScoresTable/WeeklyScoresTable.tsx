import React from "react";
import styled from "styled-components";
import Link from "next/link";

import User from "src/types/User";
import pageSizes from "src/styles/pageSizes";
import colours from "src/styles/colours";

export interface Props {
  leagueName: string;
  users: User[];
  leagueId: number;
  gameweekStart: number;
  fixtureWeeksAvailable: number[] | null;
}

const WeeklyScoresTable = ({
  users,
  leagueId,
  gameweekStart,
  fixtureWeeksAvailable,
}: Props) => {
  return (
    <Container>
      {fixtureWeeksAvailable ? (
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
                    <ClickableRowHeading
                      href={`/league/${leagueId}/week/${week}`}
                    >
                      <WeekText>Week</WeekText>
                      <WeekNumber>{week}</WeekNumber>
                    </ClickableRowHeading>
                  ) : (
                    <RowHeading>{`Week ${week}`}</RowHeading>
                  )}
                </HeaderItem>
              ))}
              <BlankTableHeaderItem />
              {users.map(({ id, weeklyPoints }) => (
                <React.Fragment key={id}>
                  <BlankTableItem />
                  {weeklyPoints?.map(({ week, points }, i) => (
                    <React.Fragment key={`${id}${week}`}>
                      <WeeklyPoints rowIndex={i} key={week}>
                        {points}
                      </WeeklyPoints>
                    </React.Fragment>
                  ))}
                  <BlankTableItem />
                </React.Fragment>
              ))}
            </AllPoints>
          </AllPointsWrapper>
        </Table>
      ) : (
        <LeagueNotStarted>
          <p>
            This league does not start until gameweek{" "}
            <Link href={`/predictions/${gameweekStart}`}>{gameweekStart}</Link>
          </p>
          <p>Come back later.</p>
        </LeagueNotStarted>
      )}
    </Container>
  );
};

const Container = styled.section`
  display: flex;
  flex-direction: column;
  gap: 4em;
  margin-top: 4em;
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
  color: ${colours.grey200};
  border-bottom: 1px solid ${colours.grey500opacity50};

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
  border: 1px solid ${colours.grey500opacity50};
  padding-bottom: 11px; /* equiv to padding-top without the transform */

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
  grid-template-columns: ${({ numWeeks }) =>
    `20px repeat(${numWeeks}, 70px) 20px`};
  grid-template-rows: ${({ numParticipants }) =>
    `58px repeat(${numParticipants}, 72px)`};
  color: ${colours.grey200};
  transform: rotateX(180deg);
  -webkit-transform: rotateX(180deg);

  @media (max-width: ${pageSizes.tablet}) {
    grid-template-columns: ${({ numWeeks }) =>
      `12px repeat(${numWeeks}, 44px) 12px`};
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

const ClickableRowHeading = styled(Link)`
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: ${colours.grey300};

  p {
    margin: 0;
    text-align: center;
  }

  :hover,
  :focus {
    color: ${colours.cyan100};
  }
`;

const WeekText = styled.p`
  font-size: 0.8rem;
  line-height: 0.8rem;

  @media (max-width: ${pageSizes.tablet}) {
    font-size: 0.5rem;
    line-height: 0.5rem;
  }
`;

const WeekNumber = styled.p`
  font-size: 1.4rem;
  line-height: 1.6rem;
  text-decoration: underline;
  text-underline-offset: 3px;
  text-decoration-thickness: 1px;

  :hover,
  :focus {
    color: ${colours.cyan100};
  }

  @media (max-width: ${pageSizes.tablet}) {
    font-size: 0.9rem;
    line-height: 1.1rem;
    text-underline-offset: 2px;
  }
`;

const Participant = styled.div`
  justify-self: flex-start;
  padding: 0 1em;
  font-size: 1.6rem;

  @media (max-width: ${pageSizes.tablet}) {
    font-size: 1rem;
    padding: 0 0.8em;
  }
`;

const TotalPoints = styled.div`
  border-left: 1px solid ${colours.grey500opacity50};
  font-size: 2rem;

  @media (max-width: ${pageSizes.tablet}) {
    font-size: 1.5rem;
  }
`;

const WeeklyPoints = styled.div<{ rowIndex: number }>``;

const LeagueNotStarted = styled.section`
  p {
    font-size: 1rem;
  }

  a {
    text-decoration: underline;
    text-underline-offset: 2px;

    :hover,
    :focus {
      color: ${colours.cyan100};
    }
  }
`;

export default WeeklyScoresTable;
