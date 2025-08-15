self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("prayer-times-cache").then((cache) => {
      return cache.addAll(["/prayer-times-data"]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
