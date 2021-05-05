import { gql } from "@apollo/client";

const typeDefs = gql`
  type Query {
    user(id: Int!): User
    userLeagues(id: Int!): [League!]
    leagueAdmin(input: LeagueAdminInput): LeagueAdminPayload
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
    createdAt: String
    updatedAt: String
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
    createdAt: String!
    users: [User!]!
    applicants: [Applicant!]
  }

  type Applicant {
    user: User!
    league: League
    status: LeagueApplicantStatus
    createdAt: String
  }

  type Fixture {
    id: Int!
    gameweek: Int!
    kickoff: String!
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
    big_boy_bonus: Boolean!
    fixture: Fixture!
    user: User!
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
