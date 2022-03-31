import { gql } from "@apollo/client";

export const USER_QUERY = gql`
  query User {
    user {
      id
      username
    }
  }
`;

export const FIXTURES_QUERY = gql`
  query Fixtures($weekId: Int!) {
    fixtures(weekId: $weekId) {
      id
      gameweek
      kickoff
      homeTeam
      awayTeam
    }
  }
`;

export const ALL_FIXTURES_QUERY = gql`
  query AllFixtures {
    allFixtures {
      fixtures {
        id
        gameweek
        kickoff
        homeTeam
        awayTeam
        homeGoals
        awayGoals
      }
      currentGameweek
    }
  }
`;

export const USER_LEAGUES_QUERY = gql`
  query UserLeagues {
    user {
      leagues {
        leagueId
        leagueName
        gameweekStart
        gameweekEnd
        users {
          id
          totalPoints
        }
      }
    }
    allFixtures {
      currentGameweek
    }
  }
`;

export const ALL_LEAGUES_QUERY = gql`
  query AllLeagues {
    allLeagues {
      leagues {
        id
        name
      }
    }
  }
`;

export const LEAGUE_ADMIN_QUERY = gql`
  query LeagueAdmin($leagueId: Int!) {
    leagueAdmin(leagueId: $leagueId) {
      league {
        id
        name
        gameweekStart
        gameweekEnd
        applicants {
          user {
            id
            username
          }
          status
        }
        users {
          id
          username
        }
      }
    }
  }
`;

export const PREDICTIONS_QUERY = gql`
  query Predictions($weekId: Int!, $userId: String) {
    predictions(weekId: $weekId, userId: $userId) {
      user {
        id
      }
      fixtureId
      homeGoals
      awayGoals
      bigBoyBonus
      score
    }
  }
`;

export const PREDICTION_AND_FIXTURE_QUERY = gql`
  query PredictionAndFixture($leagueId: Int!, $weekId: Int!, $userId: String!) {
    predictionAndFixture(weekId: $weekId, userId: $userId) {
      predictions {
        fixtureId
        gameweek
        kickoff
        homeTeam
        awayTeam
        homeGoals
        awayGoals
        bigBoyBonus
        score
      }
    }
  }
`;

export const LEAGUE_QUERY = gql`
  query League($leagueId: Int!) {
    league(leagueId: $leagueId) {
      name
      gameweekStart
      gameweekEnd
      administratorId
      users {
        id
        username
        weeklyPoints {
          week
          points
        }
        totalPoints
      }
    }
  }
`;

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

export const PREMIER_LEAGUE_QUERY = gql`
  query PremierLeagueTable {
    premierLeagueTable {
      team
      points
      wins
      draws
      losses
      homeGoals
      awayGoals
      homeGoalsConceded
      awayGoalsConceded
    }
  }
`;
