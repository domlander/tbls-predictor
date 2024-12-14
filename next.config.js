const { withSentryConfig } = require("@sentry/nextjs");

const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  experimental: {
    instrumentationHook: true,
  },
};

/**
 * Additional config options for the Sentry webpack plugin.
 */
const sentryWebpackPluginOptions = {
  // Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, configFile, stripPrefix, urlPrefix, include, ignore

  org: "dominik-lander",
  project: "tbls-predictor",

  // An auth token is required for uploading source maps.
  authToken: process.env.SENTRY_AUTH_TOKEN,

  silent: true, // Suppresses all logs

  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

/**
 * Optional build-time configuration options
 */
const sentryOptions = {
  // See the sections below for information on the following options:
  //   'Configure Source Maps':
  //     - disableServerWebpackPlugin
  //     - disableClientWebpackPlugin
  hideSourceMaps: true,
  //     - widenClientFileUpload
  //   'Configure Legacy Browser Support':
  //     - transpileClientSDK
  //   'Configure Serverside Auto-instrumentation':
  //     - autoInstrumentServerFunctions
  //     - excludeServerRoutes
  //   'Configure Tunneling to avoid Ad-Blockers':
  //     - tunnelRoute
};

// Make sure adding Sentry options is the last code to run before exporting
module.exports = withSentryConfig(nextConfig, {
  ...sentryWebpackPluginOptions,
  ...sentryOptions,
});
