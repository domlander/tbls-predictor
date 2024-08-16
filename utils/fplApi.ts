import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import axios from "axios";
import * as Sentry from "@sentry/nextjs";
import Fixture from "src/types/Fixture";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Europe/London");

/* eslint-disable camelcase */
export type FplApiFixture = {
  kickoff_time: string;
  team_h: number;
  team_a: number;
  team_h_score: number;
  team_a_score: number;
  finished: boolean;
};

export const FPL_API_FIXTURES_ENDPOINT =
  "https://fantasy.premierleague.com/api/fixtures";

export const mapFplApiFixtureToFixture = (
  fixture: FplApiFixture,
  currentGameweek: number
): Partial<Fixture> => ({
  gameweek: currentGameweek,
  homeTeam: teamsDictionary[fixture.team_h],
  awayTeam: teamsDictionary[fixture.team_a],
  homeGoals: fixture.team_h_score ?? null,
  awayGoals: fixture.team_a_score ?? null,
  kickoff: dayjs(fixture.kickoff_time).utc(true).toDate(),
});

interface TeamsDictionary {
  [key: number]: string;
}
export const teamsDictionary: TeamsDictionary = {
  1: "Arsenal",
  2: "Aston Villa",
  3: "Bournemouth",
  4: "Brentford",
  5: "Brighton",
  6: "Chelsea",
  7: "Crystal Palace",
  8: "Everton",
  9: "Fulham",
  10: "Ipswich",
  11: "Leicester",
  12: "Liverpool",
  13: "Man City",
  14: "Man Utd",
  15: "Newcastle",
  16: "Nott'm Forest",
  17: "Southampton",
  18: "Spurs",
  19: "West Ham",
  20: "Wolves",
};

/**
 *  Fetches fixtures from the FPL API and maps to our Fixture type
 */
export const getFixturesFromApiForGameweek = async (gameweek: number) => {
  const url = `${FPL_API_FIXTURES_ENDPOINT}/?event=${gameweek}`;

  let apiData;
  try {
    apiData = await axios
      .get(url, {
        headers: {
          "user-agent": "not axios", // FPL API blocks axios https://stackoverflow.com/a/68603202
        },
      })
      .then((resp) => resp.data);
  } catch (e) {
    Sentry.captureException(e);
    throw new Error(
      `There was an error fetching fixture data from the FPL API:\n${e}`
    );
  }

  const fixturesFromApi: Fixture[] = apiData.map((fixture: FplApiFixture) =>
    mapFplApiFixtureToFixture(fixture, gameweek)
  );

  return fixturesFromApi;
};
