import dayjs from "dayjs";
import Fixture from "src/types/Fixture";

type PartialFixture = Pick<Fixture, "id" | "gameweek" | "kickoff">;

const FIRST_GAMEWEEK = 1;

// Returns the current gameweek given a list of fixtures
// Current gameweek: The fixture with the earliest kickoff that is today or in the future
export function calculateCurrentGameweek(fixtures: PartialFixture[]): number {
  if (!fixtures?.length) return FIRST_GAMEWEEK;

  const lastFixture = fixtures[fixtures.length - 1];

  return fixtures.reduce((acc, cur) => {
    if (
      !cur?.kickoff ||
      dayjs(cur.kickoff).isBefore(new Date(), "day") ||
      !dayjs(cur.kickoff, "day").isBefore(dayjs(acc.kickoff, "day"))
    ) {
      return acc;
    }

    return cur;
  }, lastFixture).gameweek;
}
