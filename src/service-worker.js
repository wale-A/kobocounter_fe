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
    icon: `https://kobocounter.com/img/icons/android/android-launchericon-192-192.png`,
    // image: `https://kobocounter.com/img/icons/android/android-launchericon-512-512.png`,
    vibrate: [300, 100, 400],
    actions: JSON.parse(data?.actions || "null") || undefined,
  };
  e.waitUntil(
    self.registration.showNotification(
      data.title || "Notified by KoboCounter",
      options
    )
  );
});

self.addEventListener("notificationclick", function (e) {
  const notification = e.notification;
  // var action = e.action;

  // if (!action) {
  //   notification.close();
  // } else
  // if (action === "close") {
  //   notification.close();
  // } else {
  self.clients.matchAll().then(function (clientList) {
    if (clientList.length > 0) {
      return clientList[0].focus();
    }

    return self.clients.openWindow("https://kobocounter.com/dashboard");
  });
  // notification.close();
  // }
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
      .catch(() => {
        return caches.match(event.request).then((cacheResponse) => {
          if (cacheResponse) {
            return cacheResponse;
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
