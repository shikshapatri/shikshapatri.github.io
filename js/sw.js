const CACHE_NAME = 'shikshapatri-v1.4.0';
const CACHE_VERSION = '1.4.0';

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
    // Cache all pictorial images (1-212)
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
    '/assets/pictorial/76.png',
    '/assets/pictorial/77.png',
    '/assets/pictorial/78.png',
    '/assets/pictorial/79.png',
    '/assets/pictorial/80.png',
    '/assets/pictorial/81.png',
    '/assets/pictorial/82.png',
    '/assets/pictorial/83.png',
    '/assets/pictorial/84.png',
    '/assets/pictorial/85.png',
    '/assets/pictorial/86.png',
    '/assets/pictorial/87.png',
    '/assets/pictorial/88.png',
    '/assets/pictorial/89.png',
    '/assets/pictorial/90.png',
    '/assets/pictorial/91.png',
    '/assets/pictorial/92.png',
    '/assets/pictorial/93.png',
    '/assets/pictorial/94.png',
    '/assets/pictorial/95.png',
    '/assets/pictorial/96.png',
    '/assets/pictorial/97.png',
    '/assets/pictorial/98.png',
    '/assets/pictorial/99.png',
    '/assets/pictorial/100.png',
    '/assets/pictorial/101.png',
    '/assets/pictorial/102.png',
    '/assets/pictorial/103.png',
    '/assets/pictorial/104.png',
    '/assets/pictorial/105.png',
    '/assets/pictorial/106.png',
    '/assets/pictorial/107.png',
    '/assets/pictorial/108.png',
    '/assets/pictorial/109.png',
    '/assets/pictorial/110.png',
    '/assets/pictorial/111.png',
    '/assets/pictorial/112.png',
    '/assets/pictorial/113.png',
    '/assets/pictorial/114.png',
    '/assets/pictorial/115.png',
    '/assets/pictorial/116.png',
    '/assets/pictorial/117.png',
    '/assets/pictorial/118.png',
    '/assets/pictorial/119.png',
    '/assets/pictorial/120.png',
    '/assets/pictorial/121.png',
    '/assets/pictorial/122.png',
    '/assets/pictorial/123.png',
    '/assets/pictorial/124.png',
    '/assets/pictorial/125.png',
    '/assets/pictorial/126.png',
    '/assets/pictorial/127.png',
    '/assets/pictorial/128.png',
    '/assets/pictorial/129.png',
    '/assets/pictorial/130.png',
    '/assets/pictorial/131.png',
    '/assets/pictorial/132.png',
    '/assets/pictorial/133.png',
    '/assets/pictorial/134.png',
    '/assets/pictorial/135.png',
    '/assets/pictorial/136.png',
    '/assets/pictorial/137.png',
    '/assets/pictorial/138.png',
    '/assets/pictorial/139.png',
    '/assets/pictorial/140.png',
    '/assets/pictorial/141.png',
    '/assets/pictorial/142.png',
    '/assets/pictorial/143.png',
    '/assets/pictorial/144.png',
    '/assets/pictorial/145.png',
    '/assets/pictorial/146.png',
    '/assets/pictorial/147.png',
    '/assets/pictorial/148.png',
    '/assets/pictorial/149.png',
    '/assets/pictorial/150.png',
    '/assets/pictorial/151.png',
    '/assets/pictorial/152.png',
    '/assets/pictorial/153.png',
    '/assets/pictorial/154.png',
    '/assets/pictorial/155.png',
    '/assets/pictorial/156.png',
    '/assets/pictorial/157.png',
    '/assets/pictorial/158.png',
    '/assets/pictorial/159.png',
    '/assets/pictorial/160.png',
    '/assets/pictorial/161.png',
    '/assets/pictorial/162.png',
    '/assets/pictorial/163.png',
    '/assets/pictorial/164.png',
    '/assets/pictorial/165.png',
    '/assets/pictorial/166.png',
    '/assets/pictorial/167.png',
    '/assets/pictorial/168.png',
    '/assets/pictorial/169.png',
    '/assets/pictorial/170.png',
    '/assets/pictorial/171.png',
    '/assets/pictorial/172.png',
    '/assets/pictorial/173.png',
    '/assets/pictorial/174.png',
    '/assets/pictorial/175.png',
    '/assets/pictorial/176.png',
    '/assets/pictorial/177.png',
    '/assets/pictorial/178.png',
    '/assets/pictorial/179.png',
    '/assets/pictorial/180.png',
    '/assets/pictorial/181.png',
    '/assets/pictorial/182.png',
    '/assets/pictorial/183.png',
    '/assets/pictorial/184.png',
    '/assets/pictorial/185.png',
    '/assets/pictorial/186.png',
    '/assets/pictorial/187.png',
    '/assets/pictorial/188.png',
    '/assets/pictorial/189.png',
    '/assets/pictorial/190.png',
    '/assets/pictorial/191.png',
    '/assets/pictorial/192.png',
    '/assets/pictorial/193.png',
    '/assets/pictorial/194.png',
    '/assets/pictorial/195.png',
    '/assets/pictorial/196.png',
    '/assets/pictorial/197.png',
    '/assets/pictorial/198.png',
    '/assets/pictorial/199.png',
    '/assets/pictorial/200.png',
    '/assets/pictorial/201.png',
    '/assets/pictorial/202.png',
    '/assets/pictorial/203.png',
    '/assets/pictorial/204.png',
    '/assets/pictorial/205.png',
    '/assets/pictorial/206.png',
    '/assets/pictorial/207.png',
    '/assets/pictorial/208.png',
    '/assets/pictorial/209.png',
    '/assets/pictorial/210.png',
    '/assets/pictorial/211.png',
    '/assets/pictorial/212.png',
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
                    return response;
                }
                return fetch(event.request);
            })
    );
});