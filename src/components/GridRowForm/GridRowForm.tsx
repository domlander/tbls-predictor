import React from "react";
import styled from "styled-components";

import type FixtureType from "src/types/Fixture";
import colours from "src/styles/colours";
import GridRowFormTeam from "../GridRowFormTeam";

export type Props = {
  homeTeam: FixtureType["homeTeam"];
  awayTeam: FixtureType["awayTeam"];
  homeTeamForm: FixtureType[];
  awayTeamForm: FixtureType[];
};

const GridRowForm = ({
  homeTeam,
  awayTeam,
  homeTeamForm,
  awayTeamForm,
}: Props) => {
  return (
    <>
      <Title>Form</Title>
      <GridRowFormTeam team={homeTeam} recentFixtures={homeTeamForm} isHome />
      <div />
      <div />
      <div />
      <GridRowFormTeam team={awayTeam} recentFixtures={awayTeamForm} />
    </>
  );
};

const Title = styled.div`
  font-size: 0.9rem !important;
  padding-left: 0.2em;
  padding-top: 0.4em;
  color: ${colours.grey300};
  font-weight: 700;
`;

export default GridRowForm;
