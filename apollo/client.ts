import { useMemo } from "react";
import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  HttpLink,
} from "@apollo/client";

let apolloClient: ApolloClient<NormalizedCacheObject> | null;

function createIsomorphLink() {
  if (typeof window === "undefined") {
    const { SchemaLink } = require("@apollo/client/link/schema");
    const { schema } = require("apollo/schema");
    return new SchemaLink({ schema });
  }
  return new HttpLink({
    uri: "/api/graphql",
    credentials: "same-origin",
  });
}

/**
 * This function is responsible for creating a new instance of Apollo Client.
 *
 * We set Apollo Client’s ssrMode option to true if the code is
 * running on the server, and to false if it’s running on the client.
 */
function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: createIsomorphLink(),
    cache: new InMemoryCache({
      typePolicies: {
        Prediction: {
          keyFields: ["user", ["id"], "fixtureId"],
        },
        UserLeague: {
          keyFields: ["leagueId"],
        },
      },
    }),
  });
}

/**
 * This function initializes Apollo Client. It merges the initial state (data
 * passed in from getStaticProps() / getServerSideProps()) with the existing client-side
 * Apollo cache, then sets that new, merged data set as the new cache for Apollo Client.
 */
export function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient();

  // If your page has Next.js data fetching methods that
  // use Apollo Client, the initial state gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();

    // Restore the cache using the data passed from getStaticProps/getServerSideProps
    // combined with the existing cached data
    _apolloClient.cache.restore({ ...existingCache, ...initialState });
  }

  // For SSG and SSR always create a new Apollo Client
  if (typeof window === "undefined") return _apolloClient;

  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function useApollo(initialState) {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}
