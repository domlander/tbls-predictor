import Fixture from "src/types/Fixture";

// Sorts by date ascending first, then by home team name. Standard weekly fixtures ordering
// Sort by kickoff time ascending and then home team name ascending.
// If kickoff time is the same, the first comparison evaluates to 0, so then the second comparison is evaluated.
const sortFixtures = (fixtures: Fixture[]): Fixture[] =>
  fixtures
    .slice()
    .sort(
      (a, b) =>
        new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime() ||
        a.homeTeam.localeCompare(b.homeTeam)
    );

export default sortFixtures;
