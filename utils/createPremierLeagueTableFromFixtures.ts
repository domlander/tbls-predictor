import Fixture from "src/types/Fixture";
import type { PremierLeagueTeam } from "src/types/PremierLeagueTeam";
import calculateMatchResult from "./calculateMatchResult";

type FixtureType = Pick<
  Fixture,
  "homeTeam" | "awayTeam" | "homeGoals" | "awayGoals"
>;

const pointAdjustments = [
  { team: "Everton", adjustment: -10, reason: "financial fair play" },
];

const calculateGoalDifference = (team: PremierLeagueTeam): number => {
  const goalsScored = team.homeGoals + team.awayGoals;
  const goalsConceded = team.homeGoalsConceded + team.awayGoalsConceded;

  return goalsScored - goalsConceded;
};

const addTeamToTable = (
  table: PremierLeagueTeam[],
  name: string,
  isHome: boolean,
  goals: number,
  conceded: number
) => {
  table.push({
    name,
    points: calculateMatchResult(goals, conceded) || 0,
    wins: goals > conceded ? 1 : 0,
    draws: goals === conceded ? 1 : 0,
    losses: goals < conceded ? 1 : 0,
    homeGoals: isHome ? goals : 0,
    awayGoals: !isHome ? goals : 0,
    homeGoalsConceded: isHome ? conceded : 0,
    awayGoalsConceded: !isHome ? conceded : 0,
  });
};

const addTeamToTableWithoutFixture = (
  teams: PremierLeagueTeam[],
  name: PremierLeagueTeam["name"]
) => {
  teams.push({
    name,
    points: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    homeGoals: 0,
    awayGoals: 0,
    homeGoalsConceded: 0,
    awayGoalsConceded: 0,
  });
};

const generatePremTable = (fixtures: FixtureType[]): PremierLeagueTeam[] => {
  const table = fixtures
    .reduce((teams, { homeTeam, awayTeam, homeGoals, awayGoals }) => {
      if (homeGoals === null || awayGoals === null) {
        const tableHomeTeam = teams.find(({ name }) => name === homeTeam);

        if (!tableHomeTeam) {
          addTeamToTableWithoutFixture(teams, homeTeam);
        }

        const tableAwayTeam = teams.find(({ name }) => name === homeTeam);
        if (!tableAwayTeam) {
          addTeamToTableWithoutFixture(teams, awayTeam);
        }

        return teams;
      }

      const tableHomeTeam = teams.find(({ name }) => name === homeTeam);
      if (!tableHomeTeam) {
        addTeamToTable(teams, homeTeam, true, homeGoals, awayGoals);
      } else {
        tableHomeTeam.points += calculateMatchResult(homeGoals, awayGoals) || 0;
        tableHomeTeam.wins +=
          calculateMatchResult(homeGoals, awayGoals) === 3 ? 1 : 0;
        tableHomeTeam.draws +=
          calculateMatchResult(homeGoals, awayGoals) === 1 ? 1 : 0;
        tableHomeTeam.losses +=
          calculateMatchResult(homeGoals, awayGoals) === 0 ? 1 : 0;
        tableHomeTeam.homeGoals += homeGoals || 0;
        tableHomeTeam.homeGoalsConceded += awayGoals || 0;
      }

      const tableAwayTeam = teams.find(({ name }) => name === awayTeam);
      if (!tableAwayTeam) {
        addTeamToTable(teams, awayTeam, false, awayGoals, homeGoals);
      } else {
        tableAwayTeam.points += calculateMatchResult(awayGoals, homeGoals) || 0;
        tableAwayTeam.wins +=
          calculateMatchResult(awayGoals, homeGoals) === 3 ? 1 : 0;
        tableAwayTeam.draws +=
          calculateMatchResult(awayGoals, homeGoals) === 1 ? 1 : 0;
        tableAwayTeam.losses +=
          calculateMatchResult(awayGoals, homeGoals) === 0 ? 1 : 0;
        tableAwayTeam.awayGoals += awayGoals || 0;
        tableAwayTeam.awayGoalsConceded += homeGoals || 0;
      }

      return teams;
    }, [] as PremierLeagueTeam[])
    .map((team) => {
      const ptsAdjustment = pointAdjustments
        .filter((edits) => edits.team === team.name)
        .reduce((total, { adjustment }) => total + adjustment, 0);

      return {
        ...team,
        name: team.name + (ptsAdjustment ? "*" : ""),
        points: team.points + ptsAdjustment,
      };
    });

  const enhancedTable: PremierLeagueTeam[] = table.map((team) => ({
    ...team,
    played: team.wins + team.draws + team.losses,
    goalsScored: team.homeGoals + team.awayGoals,
    goalsConceded: team.homeGoalsConceded + team.awayGoalsConceded,
    goalDifference:
      team.homeGoals +
      team.awayGoals -
      (team.homeGoalsConceded + team.awayGoalsConceded),
  }));

  const sortedTable: PremierLeagueTeam[] = enhancedTable.sort((a, b) => {
    return (
      b.points - a.points ||
      calculateGoalDifference(b) - calculateGoalDifference(a) || // Goal diff
      b.homeGoals + b.awayGoals - (a.homeGoals + a.homeGoals) || // Goals scored
      a.name.localeCompare(b.name)
    );
  });

  return sortedTable;
};

export default generatePremTable;
