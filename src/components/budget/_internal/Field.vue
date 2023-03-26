<template>
  <div class="kv">
    <label class="kv__key">{{ label }}</label>
    <label class="kv__value" :style="`color: ${labelColor || 'unset'}`">{{
      value || "-"
    }}</label>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
@Options({
  props: {
    label: String,
    value: String,
    labelColor: String,
  },
})
export default class KeyValue extends Vue {
  value!: string;
  label!: string;
  labelColor?: string;
}
</script>

<style lang="scss" scoped>
.kv {
  display: flex;
  flex-direction: row;
  margin-bottom: 8px;
  overflow-wrap: break-word;
  color: #364156;
  justify-content: space-between;
  margin-bottom: 16px;

  @at-root #{&}__key {
    font-weight: 600;
    font-size: 13px;
    line-height: 13px;
    width: 50%;
  }

  @at-root #{&}__value {
    font-size: 13px;
    line-height: 16px;
  }
}
</style>
