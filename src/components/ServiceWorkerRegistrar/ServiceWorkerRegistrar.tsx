'use client';

import { useEffect } from 'react';

// регистрация service worker (см. docs/pwa-plan.md)
// только в production - в dev SW мешает HMR
const ServiceWorkerRegistrar = (): React.ReactNode => {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
      const register = () => navigator.serviceWorker.register('/sw.js');

      if (document.readyState === 'complete') {
        register();
      } else {
        window.addEventListener('load', register, { once: true });
        return () => window.removeEventListener('load', register);
      }
    }

    return undefined;
  }, []);

  return null;
};

ServiceWorkerRegistrar.displayName = 'ServiceWorkerRegistrar';

export default ServiceWorkerRegistrar;
