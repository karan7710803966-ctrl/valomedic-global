const CACHE_NAME = 'valomedic-pwa-v1';
const OFFLINE_ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

// Install: pre-cache core shell using relative paths for GitHub Pages subpath compatibility
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(OFFLINE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate: clean up outdated caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: network-first for HTML & live APIs (Razorpay, PayPal, Exchange Rates), cache-first fallback for static assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Bypass service worker for non-GET requests and live payment/exchange APIs
  if (
    request.method !== 'GET' ||
    url.hostname.includes('razorpay.com') ||
    url.hostname.includes('paypal.com') ||
    url.hostname.includes('open.er-api.com') ||
    url.hostname.includes('translate.google')
  ) {
    return;
  }

  // Navigation requests: Network-first with cached index.html fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Other GET requests: Stale-while-revalidate / cache fallback
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
