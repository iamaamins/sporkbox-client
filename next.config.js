/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: [
      'cdn.sporkbox.app',
      'cdn-dev.sporkbox.app',
      'd1nsp5ljvyq4nc.cloudfront.net',
    ],
  },
};

module.exports = nextConfig;

const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withSentryConfig(
  module.exports,
  {
    silent: true,
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
    authToken: process.env.SENTRY_AUTH_TOKEN,
  },
  {
    widenClientFileUpload: true,
    transpileClientSDK: true,
    tunnelRoute: '/monitoring',
    hideSourceMaps: true,
    disableLogger: true,
  }
);
