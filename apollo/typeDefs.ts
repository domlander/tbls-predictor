import { gql } from "@apollo/client";

const typeDefs = gql`
  scalar DateTime

  type Query {
    user(id: Int!): User
    userLeagues(id: Int!): [League!]
    leagueAdmin(input: LeagueAdminInput): LeagueAdminPayload
    predictions(input: PredictionsInput): PredictionsPayload
  }

  type Mutation {
    updateUsername(userId: Int!, username: String!): String
    updatePredictions(input: [UpdatePredictionsInput!]!): Boolean
    createLeague(input: CreateLeagueInput!): League
    requestToJoinLeague(userId: Int!, leagueId: Int!): Applicant
    processJoinLeagueRequest(
      userId: Int!
      leagueId: Int!
      applicantId: Int!
      isAccepted: Boolean!
    ): Boolean!
  }

  input PredictionsInput {
    userId: Int!
    weekId: Int!
  }

  type PredictionsPayload {
    fixturesWithPredictions: [FixtureWithPrediction]
    thisGameweek: Int!
    firstGameweek: Int!
    lastGameweek: Int!
  }

  input LeagueAdminInput {
    userId: Int!
    leagueId: Int!
  }

  type LeagueAdminPayload {
    id: Int!
    name: String!
    applicants: [Applicant!]
    participants: [User!]!
  }

  input CreateLeagueInput {
    userId: Int!
    name: String!
    gameweekStart: Int!
    gameweekEnd: Int!
  }

  input UpdatePredictionsInput {
    userId: Int!
    fixtureId: Int!
    homeGoals: Int
    awayGoals: Int
    big_boy_bonus: Boolean
  }

  input UserInput {
    id: Int
    email: String
  }

  type User {
    id: Int!
    username: String
    email: String
    emailVerified: String
    image: String
    createdAt: DateTime
    updatedAt: DateTime
    predictions: [Prediction!]
    leagues: [League!]
    leagueApplications: [Applicant!]
  }

  type League {
    id: Int!
    name: String!
    status: LeagueStatus!
    administratorId: Int!
    season: String!
    gameweekStart: Int!
    gameweekEnd: Int!
    createdAt: DateTime!
    users: [User!]!
    applicants: [Applicant!]
  }

  type Applicant {
    user: User!
    league: League
    status: LeagueApplicantStatus
    createdAt: DateTime
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

  type Prediction {
    homeGoals: Int
    awayGoals: Int
    score: Int
    big_boy_bonus: Boolean
    fixture: Fixture
    user: User
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

  type FixtureWithPrediction {
    fixtureId: Int!
    gameweek: Int!
    kickoff: DateTime!
    homeTeam: String!
    awayTeam: String!
    homeGoals: Int
    awayGoals: Int
    predictedHomeGoals: Int
    predictedAwayGoals: Int
    predictedScore: Int
  }
`;

export default typeDefs;
