import Fixture from "src/types/Fixture";
import type { PremierLeagueTeam } from "src/types/PremierLeagueTeam";
import calculateMatchResult from "./calculateMatchResult";

type FixtureType = Pick<
  Fixture,
  "homeTeam" | "awayTeam" | "homeGoals" | "awayGoals"
>;

const calculateGoalDifference = (team: PremierLeagueTeam): number => {
  const goalsScored = team.homeGoals + team.awayGoals;
  const goalsConceded = team.homeGoalsConceded + team.awayGoalsConceded;

  return goalsScored - goalsConceded;
};

const addTeamToTable = (
  table: PremierLeagueTeam[],
  team: string,
  isHome: boolean,
  goals: number,
  conceded: number
) => {
  table.push({
    team,
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

const createPremierLeagueTableFromFixtures = (
  fixtures: FixtureType[]
): PremierLeagueTeam[] => {
  const table = fixtures.reduce(
    (teams, { homeTeam, awayTeam, homeGoals, awayGoals }) => {
      if (homeGoals === null || awayGoals === null) return teams;

      const tableHomeTeam = teams.find(({ team }) => team === homeTeam);
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

      const tableAwayTeam = teams.find(({ team }) => team === awayTeam);
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
    },
    [] as PremierLeagueTeam[]
  );

  const sortedTable = table.sort((a, b) => {
    return (
      b.points - a.points ||
      calculateGoalDifference(b) - calculateGoalDifference(a) ||
      b.homeGoals + b.awayGoals - (a.homeGoals + a.homeGoals) || // Who's scored the most goals?
      a.team.localeCompare(b.team)
    );
  });

  return sortedTable;
};

export default createPremierLeagueTableFromFixtures;
