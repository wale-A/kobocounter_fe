<template>
  <button class="floating-button" @click="addAccount" title="Add an account">
    +
  </button>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  props: {},
  methods: {
    addAccount() {
      const fn = (code: string) => this.$store.dispatch("addAccount", { code });
      const options = {
        onSuccess: function (response: { code: string }) {
          fn(response.code);
        },
      };
      this.$launchMono(options);
    },
  },
})
export default class AddNewAccount extends Vue {}
</script>

<style scoped>
.floating-button {
  padding: 2px 15px;
  width: unset !important;
  font-size: 2em;
  border-radius: 50%;
  position: fixed;
  top: 90%;
  left: 90%;
  transition: all 0.2s ease-in 0s;
  z-index: 9999;
  cursor: pointer;
  margin: 0;
}

@media screen and (max-width: 700px) {
  .floating-button {
    top: 90%;
    left: 83%;
  }
}
</style>
