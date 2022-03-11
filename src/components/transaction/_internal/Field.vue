<template>
  <div class="field mid-text" :class="[orientation]">
    <label class="small-text accent-color">{{ label }}</label>
    <slot name="value">
      <label>{{ value || "-" }}</label>
    </slot>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
@Options({
  props: {
    label: String,
    value: String,
    orientation: {
      type: String,
      default: "row",
    },
  },
})
export default class Field extends Vue {}
</script>

<style scoped>
.field {
  display: flex;
  flex-direction: row;
}
.field.column {
  flex-direction: column;
}
</style>
