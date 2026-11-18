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
  // базовые security-заголовки (CSP намеренно не задаём: GTM и inline-скрипты
  // Next требуют nonce-инфраструктуры, иначе ломается аналитика)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
