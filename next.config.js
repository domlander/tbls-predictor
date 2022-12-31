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
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#use-hidden-source-map
    // Depending on your deployment setup, adding sentry/nextjs to your app may cause your source code 
    // to be visible in browser devtools when it wasn't before. (This happens because of the default 
    // behavior of Webpack's source-map built-in devtool.) To prevent this, you can use hidden-source-map 
    // rather than source-map, which will prevent your built files from containing a sourceMappingURL comment, 
    // thus making sourcemaps invisible to the browser
    hideSourceMaps: true
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
