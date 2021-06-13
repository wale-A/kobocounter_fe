const staticCacheName = "kobocounter-cache-v1";
const OFFLINE_URL = "/404";
const cacheAllowlist = [staticCacheName];

self.__precacheManifest = [].concat(self.__precacheManifest || []);

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      if (cache) {
        cache.add(new Request(OFFLINE_URL, { cache: "reload" }));
      }
    })
  );

  self.skipWaiting();
});

self.addEventListener("push", function (e) {
  const data = e.data.json();
  const options = {
    body: data.body,
    icon: `https://kobocounter.com/img/icons/android/android-launchericon-48-48.png`,
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
    fetch(event.request)
      .then((response) => {
        return caches.open(staticCacheName).then((cache) => {
          cache.put(event.request.url, response.clone());
          return response;
        });
      })
      .catch((error) => {
        console.log("error occurred fetching data");
        return caches.match(event.request).then((cacheResponse) => {
          if (cacheResponse) {
            return cacheResponse;
          } else {
            return caches.match(OFFLINE_URL);
          }
        });
      })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    cacheAllowlist.map((name) => {
      caches.delete(name);
    })
  );
});
