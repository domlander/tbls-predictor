import React, { Fragment } from "react";
import Heading from "src/components/Heading";
import colours from "src/styles/colours";
import pageSizes from "src/styles/pageSizes";
import type { PremierLeagueTeamDisplay } from "src/types/PremierLeagueTeam";
import styled, { keyframes } from "styled-components";

interface Props {
  teams: PremierLeagueTeamDisplay[];
  heading?: string;
  loading?: boolean;
}

const PremierLeague = ({
  teams,
  heading = "Premier League",
  loading = false,
}: Props) => {
  return (
    <Container>
      <Heading level="h1" variant="secondary">
        {heading}
      </Heading>
      <Table>
        <HeaderRow />
        <HeaderRowFirst>Club</HeaderRowFirst>
        <HeaderRow>P</HeaderRow>
        <HeaderRow>W</HeaderRow>
        <HeaderRow>D</HeaderRow>
        <HeaderRow>L</HeaderRow>
        <HeaderRow>GF</HeaderRow>
        <HeaderRow>GA</HeaderRow>
        <HeaderRow>GD</HeaderRow>
        <HeaderRowLast>PTS</HeaderRowLast>
        {loading
          ? [...Array(20)].map((_, i) => (
              <>
                <TableDataPosition position={i + 1}>{i + 1}</TableDataPosition>
                <LoadingRow />
              </>
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
                  points,
                },
                i
              ) => {
                return (
                  <Fragment key={team}>
                    <TableDataPosition position={i + 1}>
                      {i + 1}
                    </TableDataPosition>
                    <TableDataFirst>{team}</TableDataFirst>
                    <TableData>{played}</TableData>
                    <TableData>{wins}</TableData>
                    <TableData>{draws}</TableData>
                    <TableData>{losses}</TableData>
                    <TableData>{goalsScored}</TableData>
                    <TableData>{goalsConceded}</TableData>
                    <TableData>{goalDifference}</TableData>
                    <TableDataLast>{points}</TableDataLast>
                  </Fragment>
                );
              }
            )}
      </Table>
    </Container>
  );
};

const getPositionBackgroundColour = (position: number): string => {
  if (position === 1) {
    return colours.gold500;
  }

  if (position > 1 && position <= 4) {
    return colours.green500;
  }

  if (position >= 18) {
    return colours.red500;
  }

  return "transparent";
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

const Table = styled.div`
  display: grid;
  grid-template-columns: max-content minmax(max-content, 14em) repeat(8, 2.4em);
  grid-template-rows: 2em repeat(20, 3em);
  font-weight: 300;
  justify-items: center;
  align-items: center;
  color: ${colours.grey200};
  font-size: 1.1rem;

  @media (max-width: ${pageSizes.tablet}) {
    font-size: 0.9rem;
    grid-template-columns: max-content minmax(max-content, 14em) repeat(8, 2em);
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

const HeaderRowLast = styled(HeaderRow)`
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

const LoadingRow = styled.div`
  grid-column: span 9;
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

const TableDataLast = styled(TableData)`
  font-weight: 700;
`;

const TableDataPosition = styled(TableData)<{ position: number }>`
  font-size: 1rem;
  padding: 3px;
  font-weight: 700;
  justify-self: flex-end;
  color: ${colours.grey400};
  width: 20px;
  height: 20px;
  background: ${({ position }) => getPositionBackgroundColour(position)};
  border-radius: 20px;
  text-align: center;

  @media (max-width: ${pageSizes.tablet}) {
    font-size: 0.9rem;
    width: 18px;
    height: 18px;
  }
`;

export default PremierLeague;
