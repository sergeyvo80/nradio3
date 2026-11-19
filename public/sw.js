/* NRadio service worker: PWA офлайн-кэш (план - docs/pwa-plan.md)
 *
 * Стратегии:
 *  - навигация (HTML)          -> stale-while-revalidate: кэш сразу, сеть обновляет в фоне
 *  - статика /_next/static/**  -> cache-first (хэшированные файлы иммутабельны)
 *  - прочие same-origin        -> network-first с таймаутом (медленная сеть → кэш)
 *  - cross-origin (аудио-стримы, GTM) -> не кэшируется вообще
 */
const CACHE_NAME = 'nradio-v5'; // v5: навигация — stale-while-revalidate (мгновенная отдача из кэша)
const PRECACHE_URLS = ['/', '/manifest.webmanifest'];
// сколько ждём сеть для НЕ-навигационных запросов при наличии кэша
const NETWORK_TIMEOUT = 2500;

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
    // обновление запускаем синхронно (waitUntil валиден в обработчике),
    // ответ формируем отдельно — из кэша, не дожидаясь сети
    const update = refreshCache(request);
    event.waitUntil(update);
    event.respondWith(navigationResponse(request, update));
    return;
  }

  if (isImmutableStatic(url.pathname)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // RSC-пейлоады (`?_rsc=<hash>`) уникальны для каждой навигации и префетча —
  // кэшировать их бессмысленно (только распухает кэш), пусть идут напрямую
  if (url.searchParams.has('_rsc')) return;

  // прочие same-origin GET (иконки и пр.)
  event.respondWith(networkFirstWithTimeout(event));
});

function isImmutableStatic(pathname) {
  return (
    pathname.startsWith('/_next/static/') ||
    pathname.startsWith('/icons/') ||
    pathname.startsWith('/_next/image') ||
    pathname === '/favicon.ico'
  );
}

/** Обновляет кэш из сети; ошибки глотает, чтобы не ломать фоновое обновление. */
async function refreshCache(request) {
  try {
    const response = await fetch(request);
    if (response.ok && response.type === 'basic') {
      const cache = await caches.open(CACHE_NAME);
      // HTML кладём под URL без query (SSR от него не зависит) — один ключ
      // на страницу, и заход на `/?station=…` обновляет app-shell `/`
      await cache.put(cacheKey(request), response.clone());
    }
  } catch {
    // сеть недоступна - остаёмся на кэше
  }
}

function cacheKey(request) {
  if (request.mode !== 'navigate') return request;
  const url = new URL(request.url);
  url.search = '';
  return url.href;
}

/**
 * Навигация: отдаём кэш мгновенно (никаких 10-секундных белых экранов),
 * а свежий HTML докатывается в фоне — он будет отдан на следующем заходе.
 */
async function navigationResponse(request, networkUpdate) {
  const cache = await caches.open(CACHE_NAME);
  // ignoreSearch: SSR-HTML не зависит от ?station= (выбор станции — клиентский),
  // поэтому все query-варианты одной страницы переиспользуют одну копию
  const cached = (await cache.match(request, { ignoreSearch: true }))
    || (await cache.match('/', { ignoreSearch: true }));

  if (cached) return cached;

  // кэша нет (первый заход) - ждём сеть
  await networkUpdate;
  const fresh = (await cache.match(request, { ignoreSearch: true }))
    || (await cache.match('/', { ignoreSearch: true }));
  if (fresh) return fresh;

  return fetch(request);
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

async function networkFirstWithTimeout(event) {
  const request = event.request;
  const cached = await caches.match(request);

  const networkRequest = fetch(request).then((response) => {
    if (response.ok && response.type === 'basic') {
      const copy = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
    }
    return response;
  });
  // если победит таймаут, позднее падение сети не должно давать unhandledrejection
  networkRequest.catch(() => {});

  if (!cached) return networkRequest;

  // есть кэш: не ждём зависшую сеть дольше таймаута
  const timeout = new Promise((resolve) => setTimeout(resolve, NETWORK_TIMEOUT, null));
  const response = await Promise.race([networkRequest.catch(() => null), timeout]);

  if (response && response.ok) return response;
  return cached;
}
