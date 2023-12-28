import dayjs from "dayjs";
import Fixture from "src/types/Fixture";

type PartialFixture = Pick<Fixture, "id" | "gameweek" | "kickoff">;

const FIRST_GAMEWEEK = 1;

// Returns the current gameweek given a list of fixtures
// Current gameweek: The fixture with the earliest kickoff that is today or in the future
export function calculateCurrentGameweek(fixtures: PartialFixture[]): number {
  if (!fixtures?.length) return FIRST_GAMEWEEK;

  const closestFixture = fixtures.reduce<PartialFixture | null>((acc, cur) => {
    if (!acc) return cur;
    if (!cur?.kickoff) return acc;

    const winningKickoff = dayjs(acc.kickoff);
    const currentKickoff = dayjs(cur.kickoff);

    if (
      !currentKickoff.isAfter(new Date(), "day") ||
      !winningKickoff.isAfter(new Date(), "day")
    ) {
      return currentKickoff.isAfter(new Date(), "day") ? cur : acc;
    }

    return currentKickoff.isAfter(new Date(), "day") ? acc : cur;
  }, null);

  return closestFixture?.gameweek || FIRST_GAMEWEEK;
}
