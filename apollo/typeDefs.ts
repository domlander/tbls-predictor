import { gql } from "@apollo/client";

const typeDefs = gql`
  scalar DateTime

  type Query {
    user: User
    allFixtures: [Fixture!]
    fixtures(input: FixturesInput): [Fixture!]
    leagues(input: LeaguesInput): LeaguesPayload
    leagueAdmin(input: LeagueAdminInput): LeagueAdminPayload
    predictions(input: PredictionsInput): [PredictionsFlat]
    leagueDetails(input: LeagueDetailsInput): LeagueDetailsPayload
    leagueWeek(input: LeagueWeekInput): LeagueWeekPayload
  }

  type Mutation {
    updateUsername(input: UpdateUsernameInput!): String
    updateFixtures(input: [UpdateFixturesInput!]!): Boolean
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

  input FixturesInput {
    gameweek: Int
  }

  input LeaguesInput {
    userId: Int
  }

  type LeaguesPayload {
    userLeagues: [UserLeagueInfo!]
    publicLeagues: [League!]
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

  input PredictionsInput {
    userId: Int!
    weekId: Int!
  }

  type PredictionsPayload {
    fixtureId: Int!
    homeGoals: Int
    awayGoals: Int
    score: Int
    big_boy_bonus: Boolean
  }

  input LeagueDetailsInput {
    leagueId: Int!
  }

  type LeagueDetailsPayload {
    leagueName: String!
    administratorId: Int!
    users: [UserTotalPoints]!
    pointsByWeek: [WeeklyPoints]!
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

  input UpdateUsernameInput {
    userId: Int!
    username: String!
  }

  input UpdateFixturesInput {
    id: Int!
    homeTeam: String!
    awayTeam: String!
  }

  input UpdatePredictionsInput {
    userId: Int!
    fixtureId: Int!
    homeGoals: Int
    awayGoals: Int
    big_boy_bonus: Boolean
  }

  input CreateLeagueInput {
    userId: Int!
    name: String!
    gameweekStart: Int!
    gameweekEnd: Int!
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

  type UserLeagueInfo {
    id: Int!
    name: String!
    position: Int
    weeksToGo: Int
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

  type PredictionsFlat {
    fixtureId: Int!
    homeGoals: Int
    awayGoals: Int
    score: Int
    big_boy_bonus: Boolean
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

  type FixtureWithUsersPredictions {
    id: Int!
    gameweek: Int!
    kickoff: DateTime!
    homeTeam: String!
    awayTeam: String!
    homeGoals: Int
    awayGoals: Int
    predictions: [Prediction!]
  }
`;

export default typeDefs;
