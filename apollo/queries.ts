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

export const HOME_PAGE_QUERY = gql`
  query HomePage($userId: String) {
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
    }
    currentGameweek
    userStats(userId: $userId) {
      perfectPerc
      correctPerc
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
    }
    currentGameweek
  }
`;

export const CURRENT_GAMEWEEK_QUERY = gql`
  query CurrentGameweek {
    currentGameweek
  }
`;

export const USER_LEAGUES_QUERY = gql`
  query UserLeagues($userId: String) {
    user(userId: $userId) {
      leagues {
        leagueId
        leagueName
        gameweekStart
        gameweekEnd
        weeksUntilStart
        weeksToGo
        position
        numParticipants
        isActive
      }
    }
    currentGameweek
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
  query Predictions($weekId: Int!) {
    predictions(weekId: $weekId) {
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
      played
      points
      wins
      draws
      losses
      goalsScored
      homeGoals
      awayGoals
      goalsConceded
      homeGoalsConceded
      awayGoalsConceded
      goalDifference
    }
  }
`;

export const PREDICTED_LEAGUE_QUERY = gql`
  query PredictedLeagueTable($userId: String!) {
    predictedLeagueTable(userId: $userId) {
      team
      played
      points
      predictedPoints
      wins
      draws
      losses
      goalsScored
      homeGoals
      awayGoals
      goalsConceded
      homeGoalsConceded
      awayGoalsConceded
      goalDifference
    }
    premierLeagueTable {
      team
      played
      points
      wins
      draws
      losses
      goalsScored
      homeGoals
      awayGoals
      goalsConceded
      homeGoalsConceded
      awayGoalsConceded
      goalDifference
    }
  }
`;
