import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import Fixture from "src/types/Fixture";

dayjs.extend(isSameOrAfter);

type PartialFixture = Pick<Fixture, "id" | "gameweek" | "kickoff">;

const FIRST_GAMEWEEK = 1;

// Returns the current gameweek given a list of fixtures
//
// Definition:
//  - current gameweek: The fixture with the earliest kickoff that is today or in the future
export function calculateCurrentGameweek(fixtures: PartialFixture[]): number {
  if (!fixtures?.length) return FIRST_GAMEWEEK;

  const closestFixture = fixtures.reduce<PartialFixture | null>((acc, cur) => {
    if (!acc) return cur;
    if (!cur?.kickoff) return acc;

    const winningKickoff = dayjs(acc.kickoff);
    const currentKickoff = dayjs(cur.kickoff);
    const today = dayjs();

    if (
      currentKickoff.isSameOrAfter(today, "day") &&
      winningKickoff.isSameOrAfter(today, "day")
    ) {
      return currentKickoff.isBefore(winningKickoff, "day") ? cur : acc;
    }

    return currentKickoff.isAfter(winningKickoff, "day") ? cur : acc;
  }, null);

  return closestFixture?.gameweek || FIRST_GAMEWEEK;
}
