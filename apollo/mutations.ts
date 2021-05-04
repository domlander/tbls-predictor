import { gql } from "@apollo/client";

export const REQUEST_TO_JOIN_LEAGUE = gql`
  mutation requestToJoinLeague($userId: Int!, $leagueId: Int!) {
    requestToJoinLeague(userId: $userId, leagueId: $leagueId) {
      user {
        id
      }
      league {
        id
      }
      status
    }
  }
`;

export const PROCESS_JOIN_LEAGUE_REQUEST = gql`
  mutation processJoinLeagueRequest(
    $userId: Int!
    $leagueId: Int!
    $applicantId: Int!
    $isAccepted: Boolean!
  ) {
    processJoinLeagueRequest(
      userId: $userId
      leagueId: $leagueId
      applicantId: $applicantId
      isAccepted: $isAccepted
    )
  }
`;

export const CREATE_LEAGUE = gql`
  mutation CreateLeague($input: CreateLeagueInput!) {
    createLeague(input: $input) {
      id
      name
    }
  }
`;
