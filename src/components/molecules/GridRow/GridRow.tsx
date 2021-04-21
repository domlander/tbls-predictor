import React from "react";
import GridItem from "../../atoms/GridItem";
import { ChipType } from "../../atoms/Chip";

interface StyleProps {}

export type Props = StyleProps & {
  datetime: string;
  homeTeam: string;
  homeScore: number;
  awayTeam: string;
  awayScore: number;
  chip?: ChipType;
  locked: boolean;
};

const GridRow = ({
  datetime,
  homeTeam,
  homeScore,
  awayTeam,
  awayScore,
  chip,
  locked,
}: Props) => (
  <>
    <GridItem locked={locked} label={datetime} alignText="center" />
    <GridItem locked={locked} label={homeTeam} alignText="right" chip={chip} />
    <GridItem locked={locked} label={homeScore} alignText="center" />
    <GridItem locked={locked} label={awayScore} alignText="center" />
    <GridItem locked={locked} label={awayTeam} alignText="left" />
  </>
);

export default GridRow;
