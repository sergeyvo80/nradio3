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
  // индикатор dev-режима: стартовый угол top-right (по умолчанию он висел
  // в левом нижнем углу и перекрывал кнопку play в плеере). Точное место —
  // dev-зона в шапке слева от «⋮»: её выравнивает utils/alignNextDevBadge
  devIndicators: {
    position: 'top-right',
  },
  // просмотр дев-версии с телефона по LAN (192.168.0.194): без этого
  // Next 16 блокирует HMR-сокет /_next/hmr с чужого origin
  allowedDevOrigins: ['192.168.0.194'],
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
