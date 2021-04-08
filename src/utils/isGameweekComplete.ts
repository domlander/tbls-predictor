import { Fixture } from "@prisma/client";

export function isGameweekComplete(fixtures: Fixture[]) {
  return (
    fixtures.every((fixture) => fixture.homeGoals !== null) &&
    fixtures.every((fixture) => fixture.awayGoals !== null)
  );
}
