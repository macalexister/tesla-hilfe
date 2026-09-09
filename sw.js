const ROOT = new URL("./", self.location.href);
const CACHE_PREFIX = `tesla-hilfe:${ROOT.pathname}:`;
// Bei jeder Aenderung an einer App-Datei erhoehen.
const CACHE_NAME = `${CACHE_PREFIX}2026-09-09-2`;
const FILES = [
  "index.html",
  "styles.css",
  "config.js",
  "content.js",
  "app.js",
  "offline.js",
  "manifest.webmanifest",
  "favicon.svg",
  "bilder/fahrstufe.svg",
  "bilder/karten-regel.svg",
  "bilder/ladeanschluss.svg",
  "bilder/ladebuchse.svg",
  "bilder/ladeleuchte.svg",
  "bilder/tempomat.svg",
  "bilder/waschmodus.svg"
];
const ASSETS = new Map(FILES.map(file => {
  const url = new URL(file, ROOT);
  return [url.pathname, url.href];
}));
ASSETS.set(ROOT.pathname, new URL("index.html", ROOT).href);

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(FILES.map(file => new Request(new URL(file, ROOT), { cache: "reload" })));
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    for (const name of await caches.keys()) {
      if (name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME) await caches.delete(name);
    }
    await self.clients.claim();
  })());
});

self.addEventListener("message", event => {
  if (event.data?.type === "ACTIVATE_UPDATE") event.waitUntil(self.skipWaiting());
});

self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);
  const asset = ASSETS.get(url.pathname);
  // Nur oeffentliche App-Dateien: keine Kontakte, Fotos, Fremdseiten oder
  // andere Projekte derselben GitHub-Pages-Domain zwischenspeichern.
  if (event.request.method !== "GET" || url.origin !== ROOT.origin || !asset) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(asset);
    if (cached) return cached;
    const response = await fetch(new Request(asset, { cache: "reload" }));
    if (!response.ok) throw new Error(`App-Datei nicht verfuegbar: ${asset} (${response.status})`);
    await cache.put(asset, response.clone());
    return response;
  })());
});
