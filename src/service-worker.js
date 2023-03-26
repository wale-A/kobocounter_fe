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
    icon: `https://kobocounter.com/img/icons/icon-192x192.png`,
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

self.addEventListener("notificationclick", function (event) {
  const notification = event.notification;
  notification.close();
  // var action = e.action;

  // if (!action) {
  //   notification.close();
  // } else
  // if (action === "close") {
  //   notification.close();
  // } else {
  event.waitUntil(
    self.clients.matchAll().then(function (clientList) {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return self.clients.openWindow("https://kobocounter.com/dashboard");
    })
  );
  // }
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode !== "navigate") {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        return caches.open(staticCacheName).then((cache) => {
          cache.put(event.request.url, response.clone());
          return response;
        });
      })
      .catch((error) => {
        return caches.match(event.request).then((cacheResponse) => {
          if (cacheResponse) {
            return cacheResponse;
          }
        });
      })
  );
});

// self.addEventListener("fetch", (event) => {
//   // We only want to call event.respondWith() if this is a navigation request
//   // for an HTML page.
//   if (event.request.mode === "navigate") {
//     event.respondWith(
//       (async () => {
//         try {
//           // First, try to use the navigation preload response if it's supported.
//           const preloadResponse = await event.preloadResponse;
//           if (preloadResponse) {
//             return preloadResponse;
//           }

//           const networkResponse = await fetch(event.request);
//           return networkResponse;
//         } catch (error) {
//           // catch is only triggered if an exception is thrown, which is likely
//           // due to a network error.
//           // If fetch() returns a valid HTTP response with a response code in
//           // the 4xx or 5xx range, the catch() will NOT be called.
//           console.log("Fetch failed; returning offline page instead.", error);

//           const cache = await caches.open(CACHE_NAME);
//           const cachedResponse = await cache.match(OFFLINE_URL);
//           return cachedResponse;
//         }
//       })()
//     );
//   }

// If our if() condition is false, then this fetch handler won't intercept the
// request. If there are any other fetch handlers registered, they will get a
// chance to call event.respondWith(). If no fetch handlers call
// event.respondWith(), the request will be handled by the browser as if there
// were no service worker involvement.
// });

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Enable navigation preload if it's supported.
      // See https://developers.google.com/web/updates/2017/02/navigation-preload
      if ("navigationPreload" in self.registration) {
        await self.registration.navigationPreload.enable();
      }
      cacheAllowlist.map((name) => {
        caches.delete(name);
      });
    })()
  );

  // Tell the active service worker to take control of the page immediately.
  self.clients.claim();
});
