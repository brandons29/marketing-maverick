import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: ['maverick.swayzemedia.com'],
    },
  },
};

export default nextConfig;
