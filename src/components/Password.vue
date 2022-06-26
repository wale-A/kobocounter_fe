<template>
  <div>
    <input
      id="password"
      :type="type"
      :value="password"
      minlength="8"
      required
      @input="$emit('update:password', $event.target.value)"
    />
    <span
      class="material-icons input-left-icon"
      @click="type = type === 'password' ? 'text' : 'password'"
    >
      {{ type === "password" ? visibility : visibility_off }}
    </span>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  props: {
    password: "",
  },
  data() {
    return {
      type: "password",
    };
  },
  emits: ["update:password"],
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
