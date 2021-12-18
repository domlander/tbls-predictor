import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Fixture } from "@prisma/client";
import axios from "axios";
import { FplApiFixture } from "./types";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Europe/London");

export const mapFplApiFixtureToFixture = (
  fixture: FplApiFixture,
  currentGameweek: number
): Partial<Fixture> => ({
  gameweek: currentGameweek,
  homeTeam: teamsDictionary[fixture.team_h],
  awayTeam: teamsDictionary[fixture.team_a],
  homeGoals: fixture.team_h_goals || null,
  awayGoals: fixture.team_a_goals || null,
  kickoff: dayjs(fixture.kickoff_time).utc(true).toDate(),
});

interface TeamsDictionary {
  [key: number]: string;
}
export const teamsDictionary: TeamsDictionary = {
  1: "Arsenal",
  2: "Aston Villa",
  3: "Brentford",
  4: "Brighton",
  5: "Burnley",
  6: "Chelsea",
  7: "Crystal Palace",
  8: "Everton",
  9: "Leicester", // FPL think Leicester is above Leeds in the alphabet :/
  10: "Leeds",
  11: "Liverpool",
  12: "Man City",
  13: "Man Utd",
  14: "Newcastle",
  15: "Norwich",
  16: "Southampton",
  17: "Spurs",
  18: "Watford",
  19: "West Ham",
  20: "Wolves",
};

export const fetchFixtureFromFplApi = async (url: string) => {
  try {
    return await axios
      .get(url, {
        headers: {
          "user-agent": "not axios", // FPL API blocks axios https://stackoverflow.com/a/68603202
        },
      })
      .then((resp) => resp.data);
  } catch (e) {
    throw new Error(
      `Could not fetch FPL API fixture data. URL: ${url}. Error: ${e}`
    );
  }
};
