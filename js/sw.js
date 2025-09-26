const CACHE_NAME = 'shikshapatri-v1.3.0';
const CACHE_VERSION = '1.3.0';

const urlsToCache = [
    '/',
    '/index.html',
    '/all-slokas.html',
    '/assets/styles-index.css',
    '/assets/styles-all.css',
    '/assets/data.json',
    '/js/script.js',
    '/js/all-slokas.js',
    '/manifest.json',
    '/assets/images/icon-192.png',
    '/assets/images/icon-512.png',
    '/assets/images/app-icon.png',
    '/assets/images/favicon.ico',
    '/assets/images/swaminarayan.jpg',
    // Cache all pictorial images (1-75)
    '/assets/pictorial/1.png',
    '/assets/pictorial/2.png',
    '/assets/pictorial/3.png',
    '/assets/pictorial/4.png',
    '/assets/pictorial/5.png',
    '/assets/pictorial/6.png',
    '/assets/pictorial/7.png',
    '/assets/pictorial/8.png',
    '/assets/pictorial/9.png',
    '/assets/pictorial/10.png',
    '/assets/pictorial/11.png',
    '/assets/pictorial/12.png',
    '/assets/pictorial/13.png',
    '/assets/pictorial/14.png',
    '/assets/pictorial/15.png',
    '/assets/pictorial/16.png',
    '/assets/pictorial/17.png',
    '/assets/pictorial/18.png',
    '/assets/pictorial/19.png',
    '/assets/pictorial/20.png',
    '/assets/pictorial/21.png',
    '/assets/pictorial/22.png',
    '/assets/pictorial/23.png',
    '/assets/pictorial/24.png',
    '/assets/pictorial/25.png',
    '/assets/pictorial/26.png',
    '/assets/pictorial/27.png',
    '/assets/pictorial/28.png',
    '/assets/pictorial/29.png',
    '/assets/pictorial/30.png',
    '/assets/pictorial/31.png',
    '/assets/pictorial/32.png',
    '/assets/pictorial/33.png',
    '/assets/pictorial/34.png',
    '/assets/pictorial/35.png',
    '/assets/pictorial/36.png',
    '/assets/pictorial/37.png',
    '/assets/pictorial/38.png',
    '/assets/pictorial/39.png',
    '/assets/pictorial/40.png',
    '/assets/pictorial/41.png',
    '/assets/pictorial/42.png',
    '/assets/pictorial/43.png',
    '/assets/pictorial/44.png',
    '/assets/pictorial/45.png',
    '/assets/pictorial/46.png',
    '/assets/pictorial/47.png',
    '/assets/pictorial/48.png',
    '/assets/pictorial/49.png',
    '/assets/pictorial/50.png',
    '/assets/pictorial/51.png',
    '/assets/pictorial/52.png',
    '/assets/pictorial/53.png',
    '/assets/pictorial/54.png',
    '/assets/pictorial/55.png',
    '/assets/pictorial/56.png',
    '/assets/pictorial/57.png',
    '/assets/pictorial/58.png',
    '/assets/pictorial/59.png',
    '/assets/pictorial/60.png',
    '/assets/pictorial/61.png',
    '/assets/pictorial/62.png',
    '/assets/pictorial/63.png',
    '/assets/pictorial/64.png',
    '/assets/pictorial/65.png',
    '/assets/pictorial/66.png',
    '/assets/pictorial/67.png',
    '/assets/pictorial/68.png',
    '/assets/pictorial/69.png',
    '/assets/pictorial/70.png',
    '/assets/pictorial/71.png',
    '/assets/pictorial/72.png',
    '/assets/pictorial/73.png',
    '/assets/pictorial/74.png',
    '/assets/pictorial/75.png',
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
    // Special handling for background images
    if (event.request.url.includes('swaminarayan.jpg')) {
        console.log('[SW] Serving background image:', event.request.url);
    }

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version or fetch from network
                if (response) {
                    if (event.request.url.includes('swaminarayan.jpg')) {
                        console.log('[SW] Serving cached background image');
                    }
                    return response;
                }

                return fetch(event.request).then(fetchResponse => {
                    // Don't cache non-successful responses
                    if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
                        return fetchResponse;
                    }

                    // Clone the response
                    const responseToCache = fetchResponse.clone();

                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                            if (event.request.url.includes('swaminarayan.jpg')) {
                                console.log('[SW] Cached background image');
                            }
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