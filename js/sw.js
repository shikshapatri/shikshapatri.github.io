const CACHE_NAME = 'shikshapatri-v1.0.0';
const CACHE_VERSION = '1.0.0';

const urlsToCache = [
    '/',
    '/index.html',
    '/assets/styles.css',
    '/assets/data.json',
    '/js/script.js',
    '/manifest.json',
    '/assets/images/icon-192.png',
    '/assets/images/icon-512.png',
    '/assets/images/app-icon.png',
    '/assets/images/favicon.ico',
    '/assets/images/swaminarayan.jpg',
    // Cache external resources
    'https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;700&family=Poppins:wght@300;400;500;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install event - cache resources
self.addEventListener('install', event => {
    console.log(`[SW] Installing version ${CACHE_VERSION}`);
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[SW] Caching app shell');
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                console.log('[SW] Skip waiting');
                return self.skipWaiting();
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log(`[SW] Activating version ${CACHE_VERSION}`);
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[SW] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('[SW] Claiming clients');
            return self.clients.claim();
        })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version or fetch from network
                return response || fetch(event.request).then(fetchResponse => {
                    // Don't cache non-successful responses
                    if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
                        return fetchResponse;
                    }

                    // Clone the response
                    const responseToCache = fetchResponse.clone();

                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });

                    return fetchResponse;
                });
            })
            .catch(() => {
                // Fallback for offline
                if (event.request.destination === 'document') {
                    return caches.match('/index.html');
                }
            })
    );
});