import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://4b2cf60f227a4e9694423661aa2e6cf7@o1086344.ingest.sentry.io/6098312",
  // Replay may only be enabled for the client-side
  integrations: [new Sentry.Replay()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 0.5,

  replaysSessionSampleRate: 0.01,
  replaysOnErrorSampleRate: 1.0,

  environment: process.env.ENVIRONMENT,

  // ...

  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
});
