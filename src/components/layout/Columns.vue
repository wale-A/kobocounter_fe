<template>
  <div
    class="columns"
    :class="{
      'columns--desktop': !onMobile,
      'columns--mobile': onMobile,
    }"
  >
    <div
      v-if="!onMobile || !isSingle"
      class="columns__item-1"
      :class="{ 'columns__item-1--desktop': !onMobile }"
    >
      <slot name="col-1"></slot>
    </div>
    <div
      v-if="!onMobile || isSingle"
      class="columns_item-2"
      :class="{ 'columns_item-2--desktop': !onMobile }"
    >
      <slot name="col-2"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
@Options({
  computed: {
    onMobile() {
      return ["xs", "sm", "md"].includes(this.$grid.breakpoint);
    },
    isSingle() {
      return this.$route?.params.id;
    },
  },
})
export default class Columns extends Vue {}
</script>

<style lang="scss" scoped>
.columns {
  @at-root #{&}--desktop {
    display: flex;
    justify-content: space-between;
    height: 85vh;
    padding: 30px;
  }

  @at-root #{&}--mobile {
    margin-bottom: 60px;
  }

  @at-root #{&}__item-1--desktop {
    background: #ffffff;
    border-radius: 5px;
    box-shadow: 0px 2px 5px rgba(54, 65, 86, 0.05);
    width: 65.5%;
    overflow: auto;
  }

  @at-root #{&}_item-2--desktop {
    background: #ffffff;
    border-radius: 5px;
    box-shadow: 0px 2px 5px rgba(54, 65, 86, 0.05);
    width: 31.5%;
    overflow: auto;
  }
}
</style>
