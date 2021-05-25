/* eslint-disable no-console */

import { register } from "register-service-worker";

if (process.env.NODE_ENV === "production") {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready(registration: ServiceWorkerRegistration) {
      // console.log(
      //   "App is being served from cache by a service worker.\n" +
      //     "For more details, visit https://goo.gl/AFskqB"
      // );
    },
    registered(registration: ServiceWorkerRegistration) {
      // console.log("Service worker has been registered.");

      registration.addEventListener("push", (e: any) => {
        const data = e.data.json();
        registration.showNotification(data.title, {
          body: "Notified by KoboCounter",
          icon: `${process.env.BASE_URL}logo.svg`,
        });
      });

      registration.addEventListener("message", (e: any) => {
        // console.log("in message");
        const data = e.data.json();
        // console.log({ data });

        if (data.type === "subscribe") {
          subscribeUser(registration, data.arg.token);
        }
      });
    },
    cached() {
      // console.log("Content has been cached for offline use.");
    },
    updatefound() {
      // console.log("New content is downloading.");
    },
    updated() {
      // console.log("New content is available; please refresh.");
    },
    offline() {
      // console.log(
      //   "No internet connection found. App is running in offline mode."
      // );
    },
    error(error) {
      // console.error("Error during service worker registration:", error);
    },
  });
}

async function subscribeUser(
  registration: ServiceWorkerRegistration,
  token: string
) {
  const subscription = registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(
      process.env.VUE_APP_VAPID_PUBLIC_KEY || ""
    ),
  });

  await fetch(`${process.env.VUE_APP_API_URL}/users/subscribe`, {
    method: "POST",
    body: JSON.stringify(subscription),
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
