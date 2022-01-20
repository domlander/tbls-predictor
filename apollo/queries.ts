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
      id
      gameweek
      kickoff
      homeTeam
      awayTeam
    }
  }
`;

export const USER_LEAGUES_QUERY = gql`
  query UserLeagues {
    user {
      leagues {
        leagueId
        leagueName
        position
        weeksToGo
      }
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
      fixtureId
      homeGoals
      awayGoals
      big_boy_bonus
      score
      user {
        id
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
          big_boy_bonus
          score
        }
      }
    }
  }
`;
