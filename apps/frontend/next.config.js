/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['@stackoverkill/shared'],
};

module.exports = nextConfig;
