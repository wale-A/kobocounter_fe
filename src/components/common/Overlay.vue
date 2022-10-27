<template>
  <div class="overlay" @click="$emit('close-modal')">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  props: {
    show: {
      type: Boolean,
      default: true,
    },
  },
})
export default class Overlay extends Vue {}
</script>

<style lang="scss" scoped>
@import "@/styles/mixins.scss";

.overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 5000;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #000000da;
}
</style>
