<template>
  <div class="field mid-text" :class="[orientation]">
    <label class="key small-text accent-color">{{ label }}</label>
    <slot name="value">
      <label class="value">{{ value || "-" }}</label>
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
      default: "column",
    },
  },
})
export default class Field extends Vue {}
</script>

<style scoped>
.field {
  display: flex;
  flex-direction: row;
  color: #2a2a2a;
  margin-top: 0.9em;
  font-size: 1em;
  overflow-wrap: break-word;
}
.field.column {
  flex-direction: column;
}
.key {
  font-weight: 700;
}
</style>
