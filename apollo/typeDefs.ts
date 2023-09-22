import { gql } from "@apollo/client";

const typeDefs = gql`
  scalar DateTime

  type FixturesWithPredictionPayload {
    fixtures: [Fixture!]
  }

  type User {
    id: String!
    username: String
    email: String
    predictions: [Prediction!]
    leagues: [UserLeague!]
    leagueApplications: [Applicant!]
    weeklyPoints: [WeeklyPoints!]
    totalPoints: Int
  }

  type Prediction {
    user: User
    fixtureId: Int!
    homeGoals: Int
    awayGoals: Int
    bigBoyBonus: Boolean
    score: Int
  }

  type League {
    id: Int!
    name: String!
    status: LeagueStatus
    administratorId: String
    gameweekStart: Int
    gameweekEnd: Int
    applicants: [Applicant!]
    users: [User!]
  }

  type UserLeague {
    leagueId: Int!
    leagueName: String!
    gameweekStart: Int!
    gameweekEnd: Int!
    users: [User!]
    weeksUntilStart: Int
    weeksToGo: Int
    position: Int
    numParticipants: Int
    isActive: Boolean
  }

  type Fixture {
    id: Int!
    gameweek: Int!
    kickoff: DateTime!
    homeTeam: String!
    awayTeam: String!
    homeGoals: Int
    awayGoals: Int
    predictions: [Prediction!]
  }

  type Applicant {
    user: User!
    league: League!
    status: LeagueApplicantStatus
    createdAt: DateTime
  }

  type WeeklyPoints {
    week: Int!
    points: Int!
  }

  enum LeagueApplicantStatus {
    applied
    accepted
    rejected
  }

  enum LeagueStatus {
    open
    started
    completed
  }
`;

export default typeDefs;
