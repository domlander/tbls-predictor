import React from "react";
import Heading from "src/components/Heading";
import colours from "src/styles/colours";
import pageSizes from "src/styles/pageSizes";
import type { PremierLeagueTeamDisplay } from "src/types/PremierLeagueTeam";
import styled from "styled-components";

interface Props {
  teams: PremierLeagueTeamDisplay[];
}

const PremierLeague = ({ teams }: Props) => {
  return (
    <Container>
      <HeadingDesktop level="h1" variant="secondary">
        Premier League Table
      </HeadingDesktop>
      <HeadingMobile level="h1" variant="secondary">
        Premier League
      </HeadingMobile>
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
        {teams.map(
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
              <>
                <TableDataPosition>{i + 1}</TableDataPosition>
                <TableDataTeam>{team}</TableDataTeam>
                <TableData>{played}</TableData>
                <TableData>{wins}</TableData>
                <TableData>{draws}</TableData>
                <TableData>{losses}</TableData>
                <TableData>{goalsScored}</TableData>
                <TableData>{goalsConceded}</TableData>
                <TableData>{goalDifference}</TableData>
                <TableDataLast>{points}</TableDataLast>
              </>
            );
          }
        )}
      </Table>
    </Container>
  );
};

const HeadingMobile = styled(Heading)`
  display: none;

  @media (max-width: ${pageSizes.tablet}) {
    display: block;
  }
`;

const HeadingDesktop = styled(Heading)`
  display: block;

  @media (max-width: ${pageSizes.tablet}) {
    display: none;
  }
`;

const Container = styled.section`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 2em;

  @media (max-width: ${pageSizes.tablet}) {
    margin-left: 0;
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

const TableData = styled.div``;

const TableDataLast = styled(TableData)`
  font-weight: 700;
`;

const TableDataPosition = styled(TableData)`
  font-weight: 700;
  justify-self: flex-end;
  color: ${colours.grey400};
`;

const TableDataTeam = styled(TableData)`
  justify-self: flex-start;
  font-size: 1.2rem;
  font-weight: 400;
  padding-left: 1em;

  @media (max-width: ${pageSizes.tablet}) {
    font-size: 1rem;
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

export default PremierLeague;
