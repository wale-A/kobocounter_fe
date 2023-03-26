<template>
  <div class="panel">
    <div v-if="title" class="panel__header">
      <slot name="title" :title="title">
        <div class="panel__title">
          <p class="panel__title-text">{{ title }}</p>
        </div>
      </slot>
    </div>
    <div class="panel__body">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
@Options({
  props: {
    title: [String, Boolean],
  },
})
export default class Panel extends Vue {}
</script>

<style lang="scss" scoped>
@import "@/styles/mixins.scss";
.panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 15px 10px;

  @include for-size(tablet-landscape-up) {
    padding: 13px 17px;
  }

  @at-root #{&}__header {
    margin-bottom: 13px;
  }

  @at-root #{&}__title {
    display: flex;
    align-content: space-between;
    flex-direction: row;
    justify-content: space-between;
  }

  @at-root #{&}__title-text {
    font-weight: 700;
    font-size: 14px;
    line-height: 19px;
    color: #2a2a2a;
    @include for-size(tablet-landscape-up) {
      font-size: 16px;
      line-height: 22px;
    }
  }

  @at-root #{&}__body {
    flex: 1;
  }
}
</style>
