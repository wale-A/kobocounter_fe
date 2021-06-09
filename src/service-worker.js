self.__precacheManifest = [].concat(self.__precacheManifest || []);

self.addEventListener("push", function (e) {
  const data = e.data.json();
  const options = {
    body: data.body,
    icon: `../public/favicon.ico`,
    image: `https://kobocounter.com/img/icons/android-launchericon-48-48.png`,
    vibrate: [100, 50, 100],
  };
  e.waitUntil(
    self.registration.showNotification(
      data.title || "Notified by KoboCounter",
      options
    )
  );
});
