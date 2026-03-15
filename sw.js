// AgroSinergia Service Worker — v1.0
const CACHE = 'agrosinergia-v1';
const OFFLINE_URL = '/index.html';

// Archivos esenciales a cachear
const PRECACHE = [
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Solo cachear peticiones GET al mismo origen
  if (e.request.method !== 'GET') return;
  
  const url = new URL(e.request.url);
  
  // Para peticiones a APIs externas (Groq, AEMET, Nominatim) → solo red
  const externalAPIs = ['api.groq.com', 'opendata.aemet.es', 'nominatim.openstreetmap.org', 'api.qrserver.com', 'tile.openstreetmap.org'];
  if (externalAPIs.some(api => url.hostname.includes(api))) return;

  e.respondWith(
    fetch(e.request)
      .then(resp => {
        // Cachear respuestas exitosas de recursos locales
        if (resp && resp.status === 200 && url.origin === self.location.origin) {
          const clone = resp.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return resp;
      })
      .catch(() => caches.match(e.request).then(cached => cached || caches.match(OFFLINE_URL)))
  );
});
