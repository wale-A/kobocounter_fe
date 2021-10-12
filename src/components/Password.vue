<template>
  <div>
    <input
      type="password"
      name="password"
      :value="password"
      @input="$emit('update:password', $event.target.value)"
      id="password"
      minlength="8"
      required
    />
    <span
      class="material-icons input-left-icon"
      id="show-password-text"
      @click="showPasswordText"
    >
      visibility
    </span>
    <span
      class="material-icons input-left-icon"
      style="display: none"
      id="hide-password-text"
      @click="hidePasswordText"
    >
      visibility_off
    </span>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  props: {
    password: "",
  },
  emits: ["update:password"],
  methods: {
    showPasswordText() {
      (document.getElementById("password") as any).type = "text";
      (document.getElementById("hide-password-text") as any).style.display =
        "unset";
      (document.getElementById("show-password-text") as any).style.display =
        "none";
    },
    hidePasswordText() {
      (document.getElementById("password") as any).type = "password";
      (document.getElementById("hide-password-text") as any).style.display =
        "none";
      (document.getElementById("show-password-text") as any).style.display =
        "unset";
    },
  },
})
export default class Password extends Vue {}
</script>

<style scoped>
.input-left-icon {
  position: absolute;
  margin-top: 0.5em;
  margin-left: -35px;
  cursor: pointer;
}

@media (min-width: 800px) {
  .input-left-icon {
    margin-top: 0.7em;
  }
}
</style>
