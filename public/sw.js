// AMEU SafeSpace Service Worker - Network-First for HTML to prevent stale cache locking
const CACHE_NAME = 'ameu-safespace-v2';

// Pre-cached static unchanging branding assets (never cache index.html here)
const STATIC_ASSETS = [
  '/manifest.webmanifest',
  '/icon.svg',
  '/icon-192.png'
];

// Sensitive paths that must never be cached
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

  // 2. Never intercept dev server dynamic assets
  if (
    url.pathname.startsWith('/@') ||
    url.pathname.startsWith('/src/') ||
    url.pathname.startsWith('/node_modules/') ||
    url.searchParams.has('v') ||
    url.pathname.endsWith('.ts') ||
    url.pathname.endsWith('.tsx')
  ) {
    return;
  }

  // 3. Sensitive paths - strictly bypass cache
  const isSensitive = SENSITIVE_URL_PATTERNS.some((pattern) => pattern.test(url.pathname));
  if (isSensitive) {
    event.respondWith(fetch(event.request));
    return;
  }

  // 4. HTML Navigation Requests - STRICT NETWORK-FIRST
  // This guarantees fresh bundle hashes on every deployment and prevents blank screen loops
  const isHTMLNavigation =
    event.request.mode === 'navigate' ||
    event.request.destination === 'document' ||
    url.pathname === '/' ||
    url.pathname.endsWith('.html');

  if (isHTMLNavigation) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        })
        .catch(async () => {
          const cached = await caches.match(event.request);
          if (cached) return cached;
          const fallback = await caches.match('/index.html');
          if (fallback) return fallback;
          return new Response('AMEU SafeSpace is offline. Please reconnect to access the service.', {
            headers: { 'Content-Type': 'text/plain' },
          });
        })
    );
    return;
  }

  // 5. Static Assets (JS, CSS, images) - Stale-while-revalidate with basic validation
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            (networkResponse.type === 'basic' || networkResponse.type === 'cors')
          ) {
            // Never cache HTML responses when expecting JS or CSS
            const contentType = networkResponse.headers.get('content-type') || '';
            const isExpectingCode = url.pathname.endsWith('.js') || url.pathname.endsWith('.css');
            if (isExpectingCode && contentType.includes('text/html')) {
              return networkResponse; // Stale SPA rewrite 404, do not cache
            }

            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        })
        .catch(() => null);

      return cachedResponse || fetchPromise;
    })
  );
});
