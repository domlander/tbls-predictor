import "reflect-metadata";

import React from "react";
import Head from "next/head";
import { Provider } from "next-auth/client";
import { AppProps } from "next/dist/next-server/lib/router/router";
import { ApolloProvider } from "@apollo/client";
import GlobalStyle from "@/styles/globalStyles";
import Layout from "@/containers/Layout";

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
        <Head>
          <title>Premier League score predictor game | DesmondTwoTwo</title>
          <meta
            property="og:title"
            content="DesmondTwoTwo score predictor game"
          />
        </Head>
        <GlobalStyle />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ApolloProvider>
    </Provider>
  );
}
