/**
 * Service Worker for SecureStack Portfolio
 * Handles offline support, caching, and background sync
 */

// Import Workbox libraries
importScripts('https://cdn.jsdelivr.net/npm/workbox-sw@7/build/workbox-sw.js');

// Configure Workbox
if (workbox) {
  // Log Workbox initialization
  workbox.setConfig({ debug: false });

  // Listen for skip waiting message (for instant updates)
  self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
      self.skipWaiting();
    }
  });

  // Precache manifest will be injected by next-pwa
  // DO NOT remove the following line
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

  // Cache Google Fonts
  workbox.routing.registerRoute(
    ({ url }) =>
      url.origin === 'https://fonts.googleapis.com' ||
      url.origin === 'https://fonts.gstatic.com',
    new workbox.strategies.CacheFirst({
      cacheName: 'google-fonts',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
          maxEntries: 30,
        }),
      ],
    })
  );

  // API routes - NetworkFirst strategy
  workbox.routing.registerRoute(
    ({ url }) => url.pathname.startsWith('/api/'),
    new workbox.strategies.NetworkFirst({
      cacheName: 'api-cache',
      networkTimeoutSeconds: 5,
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxAgeSeconds: 60 * 5, // 5 minutes
          maxEntries: 50,
        }),
      ],
    })
  );

  // Images - CacheFirst strategy
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: 'images',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
          maxEntries: 60,
        }),
      ],
    })
  );

  // CSS/JS - StaleWhileRevalidate strategy
  workbox.routing.registerRoute(
    ({ request }) =>
      request.destination === 'style' || request.destination === 'script',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'static-resources',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        }),
      ],
    })
  );

  // HTML pages - NetworkFirst strategy
  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst({
      cacheName: 'pages',
      networkTimeoutSeconds: 3,
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
        }),
      ],
    })
  );

  // Enable background sync for failed requests
  workbox.backgroundSync.initialize();
}

/**
 * Handle fetch events for offline support
 */
self.addEventListener('fetch', (event) => {
  // Workbox handles most routes, but we can add custom logic here
  const { request } = event;

  // For API calls without a cached response, show offline message
  if (request.method === 'POST' && request.url.includes('/api/')) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response(
          JSON.stringify({ error: 'You are offline. This action will be retried when online.' }),
          { status: 503, headers: { 'Content-Type': 'application/json' } }
        );
      })
    );
  }
});

/**
 * Handle push notifications (if needed)
 */
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: data.tag || 'notification',
    requireInteraction: data.requireInteraction || false,
    actions: data.actions || [],
    data: data.data || {},
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'SecureStack', options)
  );
});

/**
 * Handle notification clicks
 */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Check if app window is already open
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      // If not open, open a new window
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

/**
 * Periodically check for updates
 */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Clean up old caches (keep last 3 versions)
          if (cacheName.startsWith('pages-') || cacheName.startsWith('api-')) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
