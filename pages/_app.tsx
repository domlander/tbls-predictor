import "reflect-metadata";

import React from "react";
import { Provider } from "next-auth/client";
import { AppProps } from "next/dist/next-server/lib/router/router";
import GlobalStyle from "@/styles/globalStyles";
import Layout from "@/containers/Layout";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider
      options={{
        clientMaxAge: 0,
        keepAlive: 0,
      }}
      session={pageProps.session}
    >
      <GlobalStyle />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}
