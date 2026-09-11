const CACHE = "ylk-infra-v1";
const CORE = [
  "./index.html",
  "./assets/css/site.css",
  "./assets/js/crypto.js",
  "./assets/js/i18n.js",
  "./assets/js/store.js",
  "./assets/js/ui.js",
  "./assets/js/site.js",
  "./assets/js/vault.enc.js",
  "./assets/img/app-icon.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then((hit) => hit || fetch(e.request).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match("./index.html")))
  );
});
