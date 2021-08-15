import { gql } from "@apollo/client";

const typeDefs = gql`
  scalar DateTime

  type Query {
    user: User
    userLeagues(id: Int!): [League!]
    leagueAdmin(input: LeagueAdminInput): LeagueAdminPayload
    predictions(input: PredictionsInput): PredictionsPayload
    leagueDetails(input: LeagueDetailsInput): LeagueDetailsPayload
    leagueWeek(input: LeagueWeekInput): LeagueWeekPayload
  }

  type Mutation {
    updateUsername(input: UpdateUsernameInput!): String
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

  input UpdateUsernameInput {
    userId: Int!
    username: String!
  }

  input LeagueWeekInput {
    leagueId: Int!
    weekId: Int!
  }

  type LeagueWeekPayload {
    leagueName: String!
    firstGameweek: Int!
    lastGameweek: Int!
    users: [UserTotalPointsWeek]!
    fixtures: [FixtureWithUsersPredictions!]!
  }

  input LeagueDetailsInput {
    leagueId: Int!
  }

  type LeagueDetailsPayload {
    leagueName: String!
    users: [UserTotalPoints]!
    pointsByWeek: [WeeklyPoints]!
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
    predictedHomeGoals: String
    predictedAwayGoals: String
    big_boy_bonus: Boolean
    predictionScore: Int
  }

  type UserTotalPoints {
    userId: Int!
    username: String!
    totalPoints: Int!
  }

  type UserTotalPointsWeek {
    userId: Int!
    username: String!
    week: Int!
    totalPoints: Int!
  }

  type WeeklyPoints {
    week: Int!
    points: [Int!]!
  }

  type FixtureWithUsersPredictions {
    id: Int!
    gameweek: Int!
    kickoff: DateTime!
    homeTeam: String!
    awayTeam: String!
    homeGoals: Int
    awayGoals: Int
    predictions: [[Int]]
  }
`;

export default typeDefs;
