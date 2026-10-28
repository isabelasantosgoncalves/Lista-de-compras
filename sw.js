// Service Worker: guarda o app no aparelho para abrir sem internet.
// Ao mudar qualquer arquivo, aumente a versão do CACHE.

const CACHE = 'despensa-v3';

const SHELL = [
  './',
  './index.html',
  './styles.css?v=3',
  './manifest.json',
  './js/icones.js?v=3',
  './js/dados.js?v=3',
  './fonts/shantell-sans.woff2',
  './js/exportar.js?v=3',
  './js/app.js?v=3',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(SHELL.map((u) => new Request(u, { cache: 'reload' }))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: false })
      .then((r) => r || fetch(e.request).catch(() => caches.match('./index.html'))),
  );
});
