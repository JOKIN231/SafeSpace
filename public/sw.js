// AMEU SafeSpace Service Worker - Privacy-Conscious Caching Policy
const CACHE_NAME = 'ameu-safespace-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icon.svg'
];

// Sensitive path regexes - strictly NEVER cached
const SENSITIVE_URL_PATTERNS = [
  /\/api\//i,
  /\/internal-access/i,
  /\/supabase/i,
  /auth/i,
  /report/i,
  /contact/i,
  /counselor/i,
  /export/i
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // 2. Strict Privacy Rule: Never cache or serve from cache any sensitive paths
  const isSensitive = SENSITIVE_URL_PATTERNS.some((pattern) => pattern.test(url.pathname));
  if (isSensitive) {
    // Network-only for sensitive data
    event.respondWith(fetch(event.request));
    return;
  }

  // 3. Stale-while-revalidate for static educational and asset content only
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch in background to revalidate
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse.clone()));
          }
        }).catch(() => {
          // Ignore background fetch error
        });
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      });
    })
  );
});
