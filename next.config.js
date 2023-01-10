/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["d1nsp5ljvyq4nc.cloudfront.net", "cdn.sporkbox.app"],
  },
};

module.exports = nextConfig;
