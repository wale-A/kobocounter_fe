<template>
  <div class="bordered-container">
    <div
      style="
        display: flex;
        align-content: space-between;
        flex-direction: row;
        justify-content: space-between;
      "
    >
      <p class="bold-text">{{ title }}</p>
      <slot name="action" />
    </div>
    <hr />
    <slot />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
@Options({
  props: {
    title: String,
  },
})
export default class Card extends Vue {}
</script>
