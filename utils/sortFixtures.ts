import { Fixture } from ".prisma/client";

// Sorts by date ascending first, then by home team name. Standard weekly fixtures ordering
// Sort by kickoff time ascending and then home team name ascending.
// If kickoff time is the same, the first comparison evaluates to 0, so then the second comparison is evaluated.
const sortFixtures = (
  fixtures: Pick<Fixture, "kickoff" | "homeTeam" | "awayTeam">[]
): Partial<Fixture>[] =>
  fixtures
    .slice()
    .sort(
      (a, b) =>
        new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime() ||
        a.homeTeam.localeCompare(b.homeTeam)
    );

export default sortFixtures;
