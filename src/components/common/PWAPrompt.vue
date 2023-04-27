<template>
  <section v-if="shown">
    Add app to home screen?

    <button @click="installPWA">Install!</button>

    <button @click="dismissPrompt">No, thanks</button>
  </section>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  data() {
    return {
      shown: false,
    };
  },
  beforeMount() {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      this.installEvent = e;
      this.shown = true;
    });
  },
})
export default class PWAPrompt extends Vue {
  shown = false;
  installEvent: any;

  installPWA() {
    this.installEvent.prompt();
    this.installEvent.userChoice.then((choice: any) => {
      this.dismissPrompt(); // Hide the prompt once the user's clicked
      if (choice.outcome === "accepted") {
        // Do something additional if the user chose to install
      } else {
        // Do something additional if the user declined
      }
    });
  }

  dismissPrompt() {
    this.shown = false;
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/mixins.scss";

.cta {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  padding-top: 1%;

  @include for-size(tablet-landscape-up) {
    padding: 2% 10%;
    height: 85vh;
  }

  @at-root #{&}__icon {
    width: 100%;
    margin-bottom: 24px;

    @include for-size(tablet-landscape-up) {
      width: 220px;
      height: 100px;
    }
  }
}
</style>
