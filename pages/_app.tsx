import "reflect-metadata";

import React from "react";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/dist/next-server/lib/router/router";
import { ApolloProvider } from "@apollo/client";
import GlobalStyle from "src/styles/globalStyles";
import Layout from "src/containers/Layout";
import Maintenance from "src/containers/Maintenance";
import { useApollo } from "../apollo/client";

export default function App({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps.initialApolloState);
  const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "1";

  return (
    <SessionProvider session={pageProps.session}>
      <ApolloProvider client={apolloClient}>
        <Head>
          <title>Premier League score predictor game | DesmondTwoTwo</title>
          <meta
            property="og:title"
            content="DesmondTwoTwo score predictor game"
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <GlobalStyle />
        <Layout>
          {isMaintenanceMode ? <Maintenance /> : <Component {...pageProps} />}
        </Layout>
      </ApolloProvider>
    </SessionProvider>
  );
}
