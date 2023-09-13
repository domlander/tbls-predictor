import { gql } from "@apollo/client";

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
