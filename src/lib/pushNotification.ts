import { State } from "@/types";
import { Store } from "vuex";

export async function subscribeUser(store: Store<State>) {
  const sw = await navigator.serviceWorker.ready;
  const subscription = await sw.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(
      process.env.VUE_APP_VAPID_PUBLIC_KEY || ""
    ),
  });

  store.dispatch("subscribeUser", {
    subscription: JSON.stringify(subscription),
  });

  // self.addEventListener("push", function (e: any) {
  //   console.log("...inside push event handler...");
  //   console.log({ e });
  //   const data = e.data.json();
  //   const options = {
  //     body: "Notified by KoboCounter",
  //     icon: `${process.env.BASE_URL}logo.svg`,
  //     vibrate: [100, 50, 100],
  //     data: {
  //       dateOfArrival: Date.now(),
  //       primaryKey: "2",
  //     },
  //     actions: [
  //       { action: "explore", title: "Explore this new world" },
  //       { action: "close", title: "Close" },
  //     ],
  //   };
  //   console.log({ options });
  //   new Notification(data.title || "title", options);

  //   e.waitUntil(
  //     (self as any).registration.showNotification(
  //       data.title || "title",
  //       options
  //     )
  //   );
  // });

  //   await fetch(`${process.env.VUE_APP_API_URL}/users/subscribe`, {
  //     method: "POST",
  //     body: JSON.stringify(subscription),
  //     headers: {
  //       "content-type": "application/json",
  //       Authorization: `Bearer ${
  //         JSON.parse(localStorage.getItem("authenticated-user") || "null")?.token
  //           ?.token
  //       }`,
  //     },
  //   });
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
