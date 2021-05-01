import { gql } from "@apollo/client";

export const GET_USER_LEAGUES = gql`
  query leagues($email: String!) {
    leagues(email: $email) {
      id
      name
    }
  }
`;
