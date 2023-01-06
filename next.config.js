/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["d1nsp5ljvyq4nc.cloudfront.net"],
  },
};

module.exports = nextConfig;
