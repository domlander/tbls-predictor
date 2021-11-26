import { gql } from "@apollo/client";

export const USER = gql`
  query User {
    user {
      id
      username
    }
  }
`;

export const FIXTURES_QUERY = gql`
  query Fixtures {
    fixtures {
      id
      gameweek
      kickoff
    }
  }
`;

export const LEAGUES = gql`
  query Leagues($input: LeaguesInput!) {
    leagues(input: $input) {
      userLeagues {
        id
        name
      }
      publicLeagues {
        id
        name
      }
    }
  }
`;

export const LEAGUE_ADMIN = gql`
  query LeagueAdmin($input: LeagueAdminInput!) {
    leagueAdmin(input: $input) {
      id
      name
      applicants {
        user {
          id
          username
        }
        status
      }
      participants {
        id
        username
      }
    }
  }
`;

export const PREDICTIONS = gql`
  query Predictions($input: PredictionsInput!) {
    predictions(input: $input) {
      thisGameweek
      firstGameweek
      lastGameweek
      fixturesWithPredictions {
        fixtureId
        gameweek
        kickoff
        homeTeam
        awayTeam
        homeGoals
        awayGoals
        big_boy_bonus
        predictedHomeGoals
        predictedAwayGoals
        predictionScore
      }
    }
  }
`;

export const LEAGUE_DETAILS = gql`
  query LeagueDetails($input: LeagueDetailsInput!) {
    leagueDetails(input: $input) {
      leagueName
      administratorId
      users {
        userId
        username
        totalPoints
      }
      pointsByWeek {
        week
        points
      }
    }
  }
`;

export const LEAGUE_WEEK = gql`
  query LeagueWeek($input: LeagueWeekInput!) {
    leagueWeek(input: $input) {
      leagueName
      firstGameweek
      lastGameweek
      users {
        userId
        username
        week
        totalPoints
      }
      fixtures {
        id
        gameweek
        kickoff
        homeTeam
        awayTeam
        homeGoals
        awayGoals
        predictions
      }
    }
  }
`;
