import { gql } from "@apollo/client";

export const UPDATE_USERNAME_MUTATION = gql`
  mutation UpdateUsername($username: String!) {
    updateUsername(username: $username) {
      id
      username
    }
  }
`;

export const REQUEST_TO_JOIN_LEAGUE_MUTATION = gql`
  mutation requestToJoinLeague($leagueId: Int!) {
    requestToJoinLeague(leagueId: $leagueId) {
      user {
        id
      }
      league {
        id
      }
      status
      createdAt
    }
  }
`;

export const PROCESS_JOIN_LEAGUE_REQUEST_MUTATION = gql`
  mutation processJoinLeagueRequest($input: ProcessJoinLeagueRequestInput!) {
    processJoinLeagueRequest(input: $input)
  }
`;

export const CREATE_LEAGUE_MUTATION = gql`
  mutation CreateLeague($input: CreateLeagueInput!) {
    createLeague(input: $input) {
      id
      name
    }
  }
`;

export const UPDATE_FIXTURES_MUTATION = gql`
  mutation UpdateFixtures($input: [UpdateFixturesInput!]!) {
    updateFixtures(input: $input)
  }
`;

export const UPDATE_PREDICTIONS_MUTATION = gql`
  mutation UpdatePredictions($input: [UpdatePredictionsInput!]!) {
    updatePredictions(input: $input) {
      predictions {
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
  }
`;
