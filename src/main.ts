import * as am4core from "@amcharts/amcharts4/core";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_kelly from "@amcharts/amcharts4/themes/kelly";
import Notifications from "@kyvg/vue3-notification";
import FloatingVue from "floating-vue";
import { createApp } from "vue";
import InlineSvgPlugin from "vue-inline-svg";
import MonoJS from "vue-mono";
import VueScreen from "vue-screen";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store/index";

const AM4_LICENSE = process.env.VUE_APP_AM4_LICENSE;
createApp(App)
  .use(router)
  .use(store)
  .use((MonoJS as any).install, {
    publicKey: process.env.VUE_APP_MONO_PUBLIC_KEY,
  })
  .use(Notifications)
  .use(VueScreen, {
    grid: {
      // use the responsive breakpoint
      xs: 0,
      sm: 576,
      md: 768,
      lg: 991,
      xl: 1200,
    },
  })
  .use(FloatingVue)
  .component("svg-icon", InlineSvgPlugin)
  .mount("#app");
if (AM4_LICENSE) {
  am4core.addLicense(AM4_LICENSE);
}
am4core.options.autoDispose = true;
am4core.useTheme(am4themes_kelly);
am4core.useTheme(am4themes_animated);
