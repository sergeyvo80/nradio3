import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
  // typescript: {
  //   ignoreBuildErrors: true,
  // },
  experimental: {
    // маркер security-апгрейда агента (Next 16.4.6)
    agentUpgrade: 'security',
  },
};

export default nextConfig;
