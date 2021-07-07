import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import MonoJS from "vue-mono";
import { store } from "./store";
import VueChartkick from "vue-chartkick";
import "chartkick/chart.js";
import Notifications, { notify } from "@kyvg/vue3-notification";

createApp(App)
  .use(router)
  .use(store)
  .use((MonoJS as any).install, {
    publicKey: process.env.VUE_APP_MONO_PUBLIC_KEY,
  })
  .use(VueChartkick as any)
  .use(Notifications)
  .mount("#app");
