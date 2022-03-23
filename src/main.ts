import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import MonoJS from "vue-mono";
import store from "./store/index";
import VueChartkick from "vue-chartkick";
import "chartkick/chart.js";
import Notifications from "@kyvg/vue3-notification";
import * as am4core from "@amcharts/amcharts4/core";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_kelly from "@amcharts/amcharts4/themes/kelly";
import InlineSvgPlugin from "vue-inline-svg";

createApp(App)
  .use(router)
  .use(store)
  .use((MonoJS as any).install, {
    publicKey: process.env.VUE_APP_MONO_PUBLIC_KEY,
  })
  .use(VueChartkick as any)
  .use(Notifications)
  .component("svg-icon", InlineSvgPlugin)
  .mount("#app");

am4core.options.autoDispose = true;
am4core.useTheme(am4themes_kelly);
am4core.useTheme(am4themes_animated);
