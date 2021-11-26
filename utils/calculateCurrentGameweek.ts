import dayjs from "dayjs";
import { Fixture } from "@prisma/client";

type PartialFixture = Pick<Fixture, "id" | "gameweek" | "kickoff">;

// Returns the current gameweek given a list of fixtures
// Current gameweek: The fixture with the earliest kickoff that is today or in the future
export function calculateCurrentGameweek(fixtures: PartialFixture[]) {
  const today = dayjs();

  const fixturesTodayOrLater = fixtures.filter(({ kickoff }) =>
    dayjs(kickoff).isAfter(today)
  );

  const firstFixtureTodayOrLater = fixturesTodayOrLater.reduce(
    (acc: PartialFixture, cur: PartialFixture) => {
      if (!acc?.kickoff || !cur?.kickoff) return acc;
      if (acc.kickoff < cur.kickoff) return acc;

      return cur;
    }
  );

  const currentGameweek = firstFixtureTodayOrLater?.gameweek;

  return currentGameweek || 1;
}
