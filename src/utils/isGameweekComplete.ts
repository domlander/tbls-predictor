import { FixtureWithPrediction } from "@/types";

export function isGameweekComplete(fixtures: FixtureWithPrediction[]) {
  return (
    fixtures.every((fixture) => fixture.homeGoals !== null) &&
    fixtures.every((fixture) => fixture.awayGoals !== null)
  );
}
