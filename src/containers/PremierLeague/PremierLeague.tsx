import { Fragment } from "react";
import Heading from "src/components/Heading";
import colours from "src/styles/colours";
import pageSizes from "src/styles/pageSizes";
import type { PremierLeagueTeam } from "src/types/PremierLeagueTeam";
import styled, { keyframes } from "styled-components";

type Props = {
  teams: PremierLeagueTeam[];
  heading?: string;
  loading?: boolean;
  isPredictedLeague?: boolean;
};

const PremierLeague = ({
  teams,
  heading = "Premier League",
  loading = false,
  isPredictedLeague = false,
}: Props) => {
  return (
    <Container>
      <Heading level="h1" variant="secondary">
        {heading}
      </Heading>
      <Table $isPredicted={isPredictedLeague}>
        <HeaderRow />
        <HeaderRowFirst>Club</HeaderRowFirst>
        <HeaderRow>P</HeaderRow>
        <HeaderRow>W</HeaderRow>
        <HeaderRow>D</HeaderRow>
        <HeaderRow>L</HeaderRow>
        {!isPredictedLeague && (
          <>
            <HeaderRow>GF</HeaderRow>
            <HeaderRow>GA</HeaderRow>
          </>
        )}
        <HeaderRow>GD</HeaderRow>
        {isPredictedLeague ? (
          <>
            <HeaderRowPoints>PTS</HeaderRowPoints>
            <HeaderRow>Act.</HeaderRow>
          </>
        ) : (
          <HeaderRowPoints>PTS</HeaderRowPoints>
        )}
        {loading
          ? [...Array(20)].map((_, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <Fragment key={i}>
                <TableDataPosition $position={i + 1}>{i + 1}</TableDataPosition>
                <LoadingRow $isPredicted={isPredictedLeague} />
              </Fragment>
            ))
          : teams?.map(
              (
                {
                  team,
                  played,
                  wins,
                  draws,
                  losses,
                  goalsScored,
                  goalsConceded,
                  goalDifference,
                  predictedPoints,
                  points,
                },
                i
              ) => {
                return (
                  <Fragment key={team}>
                    <TableDataPosition $position={i + 1}>
                      {i + 1}
                    </TableDataPosition>
                    <TableDataFirst>{team}</TableDataFirst>
                    <TableData>{played}</TableData>
                    <TableData>{wins}</TableData>
                    <TableData>{draws}</TableData>
                    <TableData>{losses}</TableData>
                    {!isPredictedLeague && (
                      <>
                        <TableData>{goalsScored}</TableData>
                        <TableData>{goalsConceded}</TableData>
                      </>
                    )}
                    <TableData>{goalDifference}</TableData>
                    {isPredictedLeague ? (
                      <>
                        <TableDataPoints>{predictedPoints}</TableDataPoints>
                        <TableData>{points}</TableData>
                      </>
                    ) : (
                      <TableDataPoints>{points}</TableDataPoints>
                    )}
                  </Fragment>
                );
              }
            )}
      </Table>
    </Container>
  );
};

const getPositionBackgroundColour = (position: number): string => {
  switch (position) {
    case 1:
      return colours.gold500;

    case 2:
    case 3:
    case 4:
      return colours.green500;

    case 18:
    case 19:
    case 20:
      return colours.red500;

    default:
      return "transparent";
  }
};

const Container = styled.section`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 2em;

  @media (max-width: ${pageSizes.tablet}) {
    margin-left: 0;
  }
`;

const Table = styled.div<{ $isPredicted: boolean }>`
  display: grid;
  grid-template-columns: ${({ $isPredicted }) => {
    const numColumns = $isPredicted ? 7 : 8;
    return `max-content minmax(max-content, 14em) repeat(${numColumns}, 2.4em)`;
  }};
  grid-template-rows: 2em repeat(20, 3em);
  font-weight: 300;
  justify-items: center;
  align-items: center;
  color: ${colours.grey200};
  font-size: 1.1rem;

  @media (max-width: ${pageSizes.tablet}) {
    font-size: 0.9rem;
    grid-template-columns: ${({ $isPredicted }) => {
      const numColumns = $isPredicted ? 7 : 8;
      return `max-content minmax(max-content, 14em) repeat(${numColumns}, 2em)`;
    }};
  }
`;

const HeaderRow = styled.div`
  color: ${colours.grey400};
  justify-items: flex-end;
  align-items: flex-end;
  font-size: 0.9rem;

  @media (max-width: ${pageSizes.tablet}) {
    font-size: 0.8rem;
  }
`;

const HeaderRowFirst = styled(HeaderRow)`
  justify-self: flex-start;
  padding-left: 1.25em;
  font-size: 0.9rem;

  @media (max-width: ${pageSizes.tablet}) {
    font-size: 0.8rem;
  }
`;

const HeaderRowPoints = styled(HeaderRow)`
  font-weight: 700;
`;

const skeletonLoading = keyframes`
    0% {
      background-position: -800px 0
    }
    100% {
      background-position: 800px 0;
    }
`;

const LoadingRow = styled.div<{ $isPredicted: boolean }>`
  grid-column: ${({ $isPredicted }) => `span ${$isPredicted ? 8 : 9}`};
  width: calc(100% - 1em);
  height: 1.5em;
  margin-left: 1em;
  animation: ${skeletonLoading} 1s linear infinite forwards;
  background: linear-gradient(
      to right,
      ${colours.blackblue400} 4%,
      ${colours.grey700} 25%,
      ${colours.blackblue400} 36%
    )
    0% 0% / 1500px 100%;
`;

const TableData = styled.div``;

const TableDataFirst = styled(TableData)`
  justify-self: flex-start;
  font-size: 1.2rem;
  font-weight: 400;
  padding-left: 1em;

  @media (max-width: ${pageSizes.tablet}) {
    font-size: 1rem;
  }
`;
const TableDataPoints = styled(TableData)`
  font-weight: 700;
`;

const TableDataPosition = styled(TableData)<{ $position: number }>`
  font-size: 1rem;
  padding: 3px;
  font-weight: 700;
  justify-self: flex-end;
  color: ${colours.grey400};
  width: 20px;
  height: 20px;
  background: ${({ $position }) => getPositionBackgroundColour($position)};
  border-radius: 20px;
  text-align: center;

  @media (max-width: ${pageSizes.tablet}) {
    font-size: 0.9rem;
    width: 18px;
    height: 18px;
  }
`;

export default PremierLeague;
