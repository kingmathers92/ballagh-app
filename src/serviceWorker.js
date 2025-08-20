self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("prayer-times-cache").then((cache) => {
      return cache.addAll([
        "/",
        "/index.html",
        "/sounds/notification.mp3",
        "/images/notification-icon.png",
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).catch(() => {
          return caches.match("/index.html");
        })
      );
    })
  );
});
