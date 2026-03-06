const CACHE_NAME = "mini-poll-v1";

const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/app.css",
  "/app.mjs",
  "/manifest.json",
  "/icons/icon.svg",
  "/i18n/translations.mjs",
  "/controller/auth_controller.mjs",
  "/controller/user_controller.mjs",
  "/data/api_service.mjs",
  "/views/user_app.mjs",
  "/views/user_created.mjs",
  "/views/user_login.mjs",
  "/views/user_settings.mjs",
  "/offline.html",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API calls: network-only, no caching
  if (url.pathname.startsWith("/users") || url.pathname.startsWith("/auth")) {
    event.respondWith(
      fetch(request).catch(() =>
        new Response(JSON.stringify({ error: "You are offline" }), {
          status: 503,
          headers: { "Content-Type": "application/json" },
        })
      )
    );
    return;
  }

  // Static assets: cache-first, fall back to offline page for navigation
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => {
          if (request.mode === "navigate") {
            return caches.match("/offline.html");
          }
        });
    })
  );
});
