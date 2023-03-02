import store from "../store/index";

export async function subscribeUser(): Promise<void> {
  navigator.serviceWorker.ready.then(function (sw) {
    sw.pushManager.getSubscription().then(function (subscription) {
      if (subscription) {
        return;
      }
      sw.pushManager
        .subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            import.meta.env.VITE_VAPID_PUBLIC_KEY || ""
          ),
        })
        .then(function (subscription) {
          store.dispatch("subscribeUser", {
            subscription: JSON.stringify(subscription),
          });
        });
    });
  });
}

export async function deleteSubscription(): Promise<void> {
  navigator.serviceWorker.ready.then(function (sw) {
    sw.pushManager.getSubscription().then(function (subscription) {
      if (!subscription) {
        return;
      }
      return subscription.unsubscribe().then(function (val) {
        if (val) {
          store.dispatch("deleteSubscription", {
            subscription: JSON.stringify(subscription),
          });
        }
      });
    });
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
