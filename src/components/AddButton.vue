<template>
  <button :title="title" class="floating-button" @click="$emit('add')">
    +
  </button>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  props: {
    title: String,
  },
})
export default class AddButton extends Vue {}
</script>

<style scoped>
.floating-button {
  padding: 2px 15px;
  width: unset !important;
  font-size: 2em;
  border-radius: 50%;
  position: fixed;
  top: 93%;
  left: 95%;
  transition: all 0.2s ease-in 0s;
  z-index: 9999;
  cursor: pointer;
  margin: 0;
  color: white;
  background-color: #007cff;
  border-color: transparent;
}

@media screen and (max-width: 900px) {
  .floating-button {
    top: 84%;
    left: 84%;
  }
}
</style>
