import { gql } from "@apollo/client";

export const LEAGUE_WEEK_QUERY = gql`
  query LeagueWeek($leagueId: Int!, $weekId: Int!) {
    league(leagueId: $leagueId) {
      id
      name
      gameweekStart
      gameweekEnd
      users {
        id
        username
        weeklyPoints {
          week
          points
        }
      }
    }
    fixturesWithPredictions(leagueId: $leagueId, weekId: $weekId) {
      fixtures {
        id
        gameweek
        kickoff
        homeTeam
        awayTeam
        homeGoals
        awayGoals
        predictions {
          fixtureId
          user {
            id
            username
          }
          homeGoals
          awayGoals
          bigBoyBonus
          score
        }
      }
    }
  }
`;
