import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import toastr from "toastr";
import MonoJS from "vue-mono";
import { store } from "./store";
import VueChartkick from "vue-chartkick";
import "chartkick/chart.js";

createApp(App)
  .use(router)
  .use(store)
  .use((MonoJS as any).install, {
    publicKey: process.env.VUE_APP_MONO_PUBLIC_KEY,
  })
  .use(VueChartkick as any)
  .mount("#app");

toastr.options = {
  closeButton: true,
  preventDuplicates: true,
  timeOut: 0,
};
