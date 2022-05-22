import dayjs from "dayjs";
import Fixture from "src/types/Fixture";

type PartialFixture = Pick<Fixture, "id" | "gameweek" | "kickoff">;

const FIRST_GAMEWEEK = 1;
const LAST_GAMEWEEK = 38;

// Returns the current gameweek given a list of fixtures
// Current gameweek: The fixture with the earliest kickoff that is today or in the future
export function calculateCurrentGameweek(fixtures: PartialFixture[]) {
  if (!fixtures?.length) return FIRST_GAMEWEEK;

  const today = dayjs();

  const allFixturesTodayOrLater = fixtures.filter(({ kickoff }) =>
    dayjs(kickoff).isAfter(today)
  );

  if (!allFixturesTodayOrLater.length) return LAST_GAMEWEEK;

  const firstFixtureTodayOrLater = allFixturesTodayOrLater.reduce(
    (acc: PartialFixture, cur: PartialFixture) => {
      if (!acc?.kickoff || !cur?.kickoff) return acc;
      if (acc.kickoff < cur.kickoff) return acc;

      return cur;
    }
  );

  return firstFixtureTodayOrLater.gameweek;
}
