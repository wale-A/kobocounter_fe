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

  console.log({ subscription });
  store.dispatch("subscribeUser", {
    subscription: JSON.stringify(subscription),
  });

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
