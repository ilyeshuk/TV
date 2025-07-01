const CACHE_NAME = "trackvibe-cache-v1";

const urlsToCache = [
  "/",
  "/index.html",
  "/index.css",
  "/index.js",
  "/To_Do.html",
  "/To_Do.css",
  "/To_Do.js",
  "/tracker_habits.html",
  "/tracker_habits.css",
  "/tracker_habits.js",
  "/sitemap.xml",
  "/manifest.json",

  // Fichiers image (favicon et icônes)
  "/Logo/android-icon-36x36.png",
  "/Logo/android-icon-48x48.png",
  "/Logo/android-icon-72x72.png",
  "/Logo/android-icon-96x96.png",
  "/Logo/android-icon-144x144.png",
  "/Logo/android-icon-192x192.png",
  "/Logo/apple-icon-57x57.png",
  "/Logo/apple-icon-60x60.png",
  "/Logo/apple-icon-72x72.png",
  "/Logo/apple-icon-76x76.png",
  "/Logo/apple-icon-114x114.png",
  "/Logo/apple-icon-120x120.png",
  "/Logo/apple-icon-144x144.png",
  "/Logo/apple-icon-152x152.png",
  "/Logo/apple-icon-180x180.png",
  "/Logo/apple-icon-precomposed.png",
  "/Logo/apple-icon.png",
  "/Logo/browserconfig.xml",
  "/Logo/favicon.ico",
  "/Logo/favicon-16x16.png",
  "/Logo/favicon-32x32.png",
  "/Logo/favicon-96x96.png",
  "/Logo/ms-icon-70x70.png",
  "/Logo/ms-icon-144x144.png",
  "/Logo/ms-icon-150x150.png",
  "/Logo/ms-icon-310x310.png",
  "/Logo/logo.png",
  "/Logo/logo-512x512.png"
];

self.addEventListener("install", event => {
  self.skipWaiting(); // activation immédiate
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim()); // prendre le contrôle de la page active
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
