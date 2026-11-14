import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://4b2cf60f227a4e9694423661aa2e6cf7@o1086344.ingest.us.sentry.io/6098312",

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;