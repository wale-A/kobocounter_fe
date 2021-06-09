/* eslint-disable no-console */

import { register } from "register-service-worker";

if (process.env.NODE_ENV === "production") {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready(registration: ServiceWorkerRegistration) {
      console.log(
        "App is being served from cache by a service worker.\n" +
          "For more details, visit https://goo.gl/AFskqB"
      );
      // subscribeUser(registration);
    },
    registered(registration: ServiceWorkerRegistration) {
      console.log("Service worker has been registered.");

      registration.addEventListener("push", (e: any) => {
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
        e.waitUntil(
          registration.showNotification(data.title || "title", options)
        );
      });

      // registration.addEventListener("message", (e: any) => {
      //   // console.log("in message");
      //   const data = e.data.json();
      //   // console.log({ data });

      //   if (data.type === "subscribe") {
      //     subscribeUser(registration, data.arg.token);
      //   }
      // });
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
