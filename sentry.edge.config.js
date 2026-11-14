import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://4b2cf60f227a4e9694423661aa2e6cf7@o1086344.ingest.us.sentry.io/6098312",

  // Capture 100%. Adjust based on your traffic volume
  tracesSampleRate: 1.0,
});
