import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
// import "bootstrap";
// import BootstrapVue from "bootstrap-vue";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap-vue/dist/css/bootstrap-vue.css";
import MonoJS from "vue-mono";

createApp(App)
  .use(router)
  .use((MonoJS as any).install, { publicKey: "live_pk_s1rNRqsZEhz4ff8paDiJ" })
  // .use(BootstrapVue)
  .mount("#app");
