import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
  // Turbopack root is configured at the CLI level (next dev --turbopack)
  // not inside experimental to avoid TypeScript errors with Next 16.
};

export default nextConfig;
