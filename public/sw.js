/* NRadio service worker: PWA офлайн-кэш (план - docs/pwa-plan.md)
 *
 * Стратегии:
 *  - навигация (HTML)          -> network-first, офлайн-фолбэк на кэш '/' (app-shell)
 *  - статика /_next/static/**  -> cache-first (хэшированные файлы иммутабельны)
 *  - прочие same-origin        -> network-first c фолбэком на кэш
 *  - cross-origin (аудио-стримы, GTM) -> не кэшируется вообще
 */
const CACHE_NAME = 'nradio-v1';
const PRECACHE_URLS = ['/', '/manifest.webmanifest'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // cross-origin (аудио-стримы, GTM и пр.) - мимо кэша
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
    return;
  }

  if (isImmutableStatic(url.pathname)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // прочие same-origin GET (RSC-пейлоады, иконки и пр.) - network-first
  event.respondWith(networkFirst(request));
});

function isImmutableStatic(pathname) {
  return (
    pathname.startsWith('/_next/static/') ||
    pathname.startsWith('/icons/') ||
    pathname === '/favicon.ico'
  );
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response.ok && response.type === 'basic') {
    const copy = response.clone();
    caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
  }
  return response;
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok && response.type === 'basic') {
      const copy = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) return cached;
    // офлайн-фолбэк навигации: app-shell с главной
    if (request.mode === 'navigate') {
      const shell = await caches.match('/');
      if (shell) return shell;
    }
    throw error;
  }
}
