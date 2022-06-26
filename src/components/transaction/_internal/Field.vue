<template>
  <div class="field" :class="{ 'field--column': orientation === 'column' }">
    <label class="field__label">{{ label }}</label>
    <slot name="value">
      <label class="field__value">{{ value || "-" }}</label>
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

<style lang="scss" scoped>
.field {
  display: flex;
  flex-direction: row;
  color: #2a2a2a;
  margin-bottom: 20px;
  overflow-wrap: break-word;

  @at-root #{&}--column {
    flex-direction: column;
  }

  @at-root #{&}__label {
    font-weight: 700;
    font-size: 14px;
    line-height: 12px;
    margin-bottom: 5px;
  }

  @at-root #{&}__value {
    font-size: 14px;
    line-height: 19px;
  }
}
</style>
