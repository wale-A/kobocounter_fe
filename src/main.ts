import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import toastr from "toastr";
import MonoJS from "vue-mono";
import { store } from "./store";
import VueChartkick from "vue-chartkick";
import "chartkick/chart.js";
// import firebase from "firebase/messaging";
import firebase from "firebase";
import "firebase/messaging";

createApp(App)
  .use(router)
  .use(store)
  .use((MonoJS as any).install, {
    publicKey: process.env.VUE_APP_MONO_PUBLIC_KEY,
  })
  .use(VueChartkick as any)
  // .component("v-select", vSelect)
  .mount("#app");

firebase.initializeApp({
  apiKey: "AIzaSyCbfEb3S7GNFT6tTaBxXv0kSwI-hQTxGYw",
  authDomain: "kobocounter.firebaseapp.com",
  projectId: "kobocounter",
  storageBucket: "kobocounter.appspot.com",
  messagingSenderId: "1090043211481",
  appId: "1:1090043211481:web:de6fa632a7adb609ab98c8",
  measurementId: "G-6BELL3C1XC",
});
firebase.analytics();

toastr.options = {
  closeButton: true,
  preventDuplicates: true,
  timeOut: 0,
};
