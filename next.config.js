/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["images.unsplash.com", "d1nsp5ljvyq4nc.cloudfront.net"],
  },
};

module.exports = nextConfig;
