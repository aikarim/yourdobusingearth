const CACHE = 'earth-journey-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest'
  // Add icons when you add them:
  // './icons/icon-192.png',
  // './icons/icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE && caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (req.method === 'GET' && res.status === 200 && !req.url.startsWith('chrome-extension')) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
      }
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});