import { Fixture } from "@prisma/client";

/* eslint-disable camelcase */
export type FplApiFixture = {
  kickoff_time: string;
  team_h: number;
  team_a: number;
  team_h_goals: number;
  team_a_goals: number;
  finished: boolean;
};

export type FixtureForPopulatingDb = {
  id?: Fixture["id"];
  gameweek: Fixture["gameweek"];
  kickoff: Fixture["kickoff"];
  homeTeam: Fixture["homeTeam"];
  awayTeam: Fixture["awayTeam"];
};
