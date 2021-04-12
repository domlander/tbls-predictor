import { gql } from "apollo-server-micro";

const typeDefs = gql`
  type Query {
    userById(id: Int): User
  }

  type Mutation {
    createLeague(league: CreateLeagueInput!): League
  }

  input CreateLeagueInput {
    name: String!
    administratorId: Int!
    gameweekStart: Int!
    gameweekEnd: Int!
    userId: Int!
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
    createdAt: String!
    updatedAt: String!
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
    league: League!
    status: LeagueApplicantStatus!
    createdAt: String!
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
