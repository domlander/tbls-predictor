/**
 * https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#create-a-custom-_error-page
 *
 * This page is loaded by Nextjs:
 *  - on the server, when data-fetching methods throw or reject
 *  - on the client, when `getInitialProps` throws or rejects
 *  - on the client, when a React lifecycle method throws or rejects, and it's
 *    caught by the built-in Nextjs error boundary
 */
import React from "react";
import * as Sentry from "@sentry/nextjs";
import type { NextPage } from "next";
import type { ErrorProps } from "next/error";
import NextErrorComponent from "next/error";

const CustomErrorComponent: NextPage<ErrorProps> = ({
  statusCode,
}: ErrorProps) => {
  return <NextErrorComponent statusCode={statusCode} />;
};

CustomErrorComponent.getInitialProps = async (contextData) => {
  // In case this is running in a serverless function, await this in order to give Sentry
  // time to send the error before the lambda exits
  await Sentry.captureUnderscoreErrorException(contextData);

  // This will contain the status code of the response
  return NextErrorComponent.getInitialProps(contextData);
};

export default CustomErrorComponent;