import { gql } from "@apollo/client";

const typeDefs = gql`
  scalar DateTime

  type Query {
    user: User
    fixtures(weekId: Int!): [Fixture!]
    allFixtures: AllFixturesPayload!
    predictions(weekId: Int!, userId: String): [Prediction!]
    allLeagues: AllLeaguesPayload!
    leagueAdmin(leagueId: Int!): LeagueAdminPayload!
    league(leagueId: Int!): League!
    predictionAndFixture(
      weekId: Int!
      userId: String!
    ): PredictionAndFixturePayload
    fixturesWithPredictions(
      leagueId: Int!
      weekId: Int!
    ): FixturesWithPredictionPayload
    premierLeagueTable: [PremierLeagueTeam]
  }

  type Mutation {
    updateUsername(username: String!): User
    requestToJoinLeague(leagueId: Int!): Applicant
    processJoinLeagueRequest(input: ProcessJoinLeagueRequestInput!): Boolean!
    createLeague(input: CreateLeagueInput!): League
    updateFixtures(input: [UpdateFixturesInput!]!): Boolean
    updatePredictions(
      input: [UpdatePredictionsInput!]!
    ): UpdatePredictionsPayload!
  }

  type LeagueAdminPayload {
    league: League!
  }

  type AllFixturesPayload {
    fixtures: [Fixture!]
    currentGameweek: Int
  }

  type AllLeaguesPayload {
    leagues: [League!]
  }

  type PredictionAndFixture {
    fixtureId: Int!
    gameweek: Int!
    kickoff: DateTime!
    homeTeam: String!
    awayTeam: String!
    homeGoals: Int
    awayGoals: Int
    bigBoyBonus: Boolean
    score: Int
  }

  type PredictionAndFixturePayload {
    predictions: [PredictionAndFixture!]
  }

  type FixturesWithPredictionPayload {
    fixtures: [Fixture!]
  }

  input ProcessJoinLeagueRequestInput {
    leagueId: Int!
    applicantId: String!
    isAccepted: Boolean!
  }

  input CreateLeagueInput {
    name: String!
    gameweekStart: Int!
    gameweekEnd: Int!
  }

  input UpdateFixturesInput {
    id: Int!
    homeTeam: String!
    awayTeam: String!
  }

  input UpdatePredictionsInput {
    userId: String!
    fixtureId: Int!
    homeGoals: Int
    awayGoals: Int
    bigBoyBonus: Boolean
    score: Int
  }

  type UpdatePredictionsPayload {
    predictions: [Prediction!]
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

  type PremierLeagueTeam {
    team: String!
    points: Int!
    wins: Int!
    draws: Int!
    losses: Int!
    homeGoals: Int!
    awayGoals: Int!
    homeGoalsConceded: Int!
    awayGoalsConceded: Int!
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
