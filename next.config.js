// https://docs.sentry.io/platforms/javascript/guides/nextjs/
const { withSentryConfig } = require("@sentry/nextjs");

const moduleExports = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  compiler: {
    // ssr and displayName are configured by default
    styledComponents: true,
  },
  sentry: {
    // See the sections below for information on the following options:
    //   'Configure Source Maps':
    //     - disableServerWebpackPlugin
    //     - disableClientWebpackPlugin
    hideSourceMaps: false
    //     - widenClientFileUpload
    //   'Configure Legacy Browser Support':
    //     - transpileClientSDK
    //   'Configure Serverside Auto-instrumentation':
    //     - autoInstrumentServerFunctions
    //     - excludeServerRoutes
    //   'Configure Tunneling to avoid Ad-Blockers':
    //     - tunnelRoute
  }
};

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not recommended:
  // release, url, org, project, authToken, configFile, stripPrefix, urlPrefix, include, ignore

  silent: true, // Suppresses all logs.
  // For all available options, see: https://github.com/getsentry/sentry-webpack-plugin#options.
};

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions);
