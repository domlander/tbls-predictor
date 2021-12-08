// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn:
    SENTRY_DSN ||
    "https://4b2cf60f227a4e9694423661aa2e6cf7@o1086344.ingest.sentry.io/6098312",
  // A number between 0 and 1, controlling the percentage chance a given transaction will be
  // sent to Sentry. 0 represents 0% while 1 represents 100%.)
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 0.2,
  environment: process.env.ENVIRONMENT,
  // ...
  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
});
