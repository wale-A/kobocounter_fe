/* eslint-disable no-console */

import { register } from "register-service-worker";

if (process.env.NODE_ENV === "production") {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready(registration: ServiceWorkerRegistration) {
      // console.log(
      //   "App is being served from cache by a service worker.\n" +
      //     "For more details, visit https://goo.gl/AFskqB"
      // );
      // subscribeUser(registration);

      registration.addEventListener("push", function (e) {
        console.log("12345");
      });

      self.addEventListener("push", function (e: any) {
        console.log("...inside push event handler...");
        console.log({ e });
        const data = e.data.json();
        const options = {
          body: "Notified by KoboCounter",
          icon: `${process.env.BASE_URL}logo.svg`,
          vibrate: [100, 50, 100],
          data: {
            dateOfArrival: Date.now(),
            primaryKey: "2",
          },
          actions: [
            { action: "explore", title: "Explore this new world" },
            { action: "close", title: "Close" },
          ],
        };
        console.log({ options });
        new Notification(data.title || "title", options);
        registration.showNotification(data.title || "title", options);
        e.waitUntil(
          (self as any).registration.showNotification(
            data.title || "title",
            options
          )
        );
      });
    },
    registered(registration: ServiceWorkerRegistration) {
      console.log("Service worker has been registered.");

      registration.addEventListener("push", function (e) {
        console.log("lorem ipsum dolot sit amen");
      });
    },
    cached() {
      console.log("Content has been cached for offline use.");
    },
    updatefound() {
      console.log("New content is downloading.");
    },
    updated() {
      console.log("New content is available; please refresh.");
    },
    offline() {
      // console.log(
      //   "No internet connection found. App is running in offline mode."
      // );
    },
    error(error) {
      console.error("Error during service worker registration:", error);
    },
  });
}
