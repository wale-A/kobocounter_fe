import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import toastr from "toastr";
import MonoJS from "vue-mono";
import { store } from "./store";

createApp(App)
  .use(router)
  .use(store)
  .use((MonoJS as any).install, {
    publicKey: process.env.VUE_APP_MONO_PUBLIC_KEY,
  })
  .mount("#app");

toastr.options = {
  closeButton: true,
  preventDuplicates: true,
  timeOut: 0,
};
