import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs/config";

const nextConfig: NextConfig = {
  // Your existing Next.js configuration
};

export default withSentryConfig(nextConfig, {
  org: "dominik-lander",
  project: "tbls-predictor",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // An auth token is required for uploading source maps.
  authToken: process.env.SENTRY_AUTH_TOKEN,
});