import "reflect-metadata";

import React from "react";
import { Provider } from "next-auth/client";
import { AppProps } from "next/dist/next-server/lib/router/router";
import GlobalStyle from "@/styles/globalStyles";
import Layout from "@/containers/Layout";

import { ApolloProvider } from "@apollo/client";
import { useApollo } from "../apollo/client";

export default function App({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <Provider
      options={{
        clientMaxAge: 0,
        keepAlive: 0,
      }}
      session={pageProps.session}
    >
      <ApolloProvider client={apolloClient}>
        <GlobalStyle />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ApolloProvider>
    </Provider>
  );
}
