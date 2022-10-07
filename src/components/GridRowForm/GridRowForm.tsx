import React from "react";
import type FixtureType from "src/types/Fixture";
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
      <div />
      <GridRowFormTeam team={homeTeam} recentFixtures={homeTeamForm} isHome />
      <div />
      <div />
      <div />
      <GridRowFormTeam team={awayTeam} recentFixtures={awayTeamForm} />
    </>
  );
};

export default GridRowForm;
