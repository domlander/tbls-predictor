import { gql } from "@apollo/client";

export const USER = gql`
  query User($id: Int!) {
    user(id: $id) {
      id
      username
    }
  }
`;

export const USER_LEAGUES = gql`
  query UserLeagues($id: Int!) {
    userLeagues(id: $id) {
      id
      name
    }
  }
`;

export const LEAGUE = gql`
  query UserLeagues($email: String!) {
    userLeagues(email: $email) {
      id
      name
    }
  }
`;
