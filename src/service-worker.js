const staticCacheName = "kobocounter-cache-v1";
const OFFLINE_URL = "/404";

self.__precacheManifest = [].concat(self.__precacheManifest || []);

self.addEventListener("install", function (event) {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(staticCacheName);
      await cache.add(new Request(OFFLINE_URL, { cache: "reload" }));
    })()
  );

  self.skipWaiting();
});

self.addEventListener("push", function (e) {
  const data = e.data.json();
  const options = {
    body: data.body,
    icon: `../public/favicon.ico`,
    image: `https://kobocounter.com/img/icons/android/android-launchericon-48-48.png`,
    vibrate: [100, 50, 100],
  };
  e.waitUntil(
    self.registration.showNotification(
      data.title || "Notified by KoboCounter",
      options
    )
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        if (response) {
          // console.log("Found ", event.request.url, " in cache");
          return response;
        }
        // console.log("Network request for ", event.request.url);
        return fetch(event.request).then((response) => {
          // TODO 5 - Respond with custom 404 page

          return caches.open(staticCacheName).then((cache) => {
            cache.put(event.request.url, response.clone());
            return response;
          });
        });
      })
      .catch((error) => {
        return caches.open(staticCacheName).then((cache) => {
          return cache.then((offlineResponse) => offlineResponse);
        });
      })
  );
});

self.addEventListener("activate", (event) => {
  console.log("Activating new service worker...");

  const cacheAllowlist = [staticCacheName];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheAllowlist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
