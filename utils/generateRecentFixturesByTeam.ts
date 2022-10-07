import Fixture from "src/types/Fixture";
import TeamFixtures from "src/types/TeamFixtures";

const getTeamsFromFixtures = (fixtures: Fixture[]): string[] => {
  return fixtures.reduce((acc, cur) => {
    if (!acc.includes(cur.homeTeam)) {
      acc.push(cur.homeTeam);
    }
    if (!acc.includes(cur.awayTeam)) {
      acc.push(cur.awayTeam);
    }
    return acc;
  }, [] as string[]);
};

const getPlayedFixtures = (
  fixtures: Fixture[],
  gameweek: number
): Fixture[] => {
  return fixtures.filter(
    (fixture) =>
      fixture.gameweek <= gameweek &&
      fixture.homeGoals !== null &&
      fixture.awayGoals !== null
  );
};

const generateRecentFixturesByTeam = (
  fixtures: Fixture[],
  selectedGameweek: number
): TeamFixtures[] => {
  const teams = getTeamsFromFixtures(fixtures);
  const playedFixtures = getPlayedFixtures(fixtures, selectedGameweek);

  const allTeamsRecentFixtures: TeamFixtures[] = [];
  teams.forEach((team) => {
    const teamsRecentFixtures = playedFixtures
      .filter(
        ({ homeTeam, awayTeam }) => homeTeam === team || awayTeam === team
      )
      .filter(({ gameweek }) => gameweek !== selectedGameweek)
      .sort((a, b) => b.gameweek - a.gameweek)
      .slice(0, 6);

    allTeamsRecentFixtures.push({ team, fixtures: teamsRecentFixtures });
  });

  return allTeamsRecentFixtures;
};

export default generateRecentFixturesByTeam;
