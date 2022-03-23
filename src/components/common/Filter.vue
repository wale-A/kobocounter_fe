<template>
  <div class="filter">
    <div class="filter-active">No Results</div>
    <button class="filter-action">
      <span class="filter-label">Filters</span>
      <svg-icon
        :src="require('@/assets/svg/filter-icon.svg')"
        class="filter-icon"
      />
    </button>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
@Options({
  props: {
    title: String,
  },
})
export default class Filter extends Vue {}
</script>

<style lang="scss" scoped>
.filter {
  align-items: center;
  display: flex;

  &-active {
    color: #727376;
    font-family: "Nunito Sans";
    font-size: 13px;
    line-height: 18px;
    margin-right: 12px;
  }

  &-action {
    align-items: center;
    background: #ffffff;
    box-shadow: 0px 4px 15px 4px rgba(54, 65, 86, 0.1);
    border: none;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
    margin-right: 24px;
    padding: 8px 29px 8px 21px;
  }

  &-label {
    color: #727376;
    font-family: "Nunito Sans";
    font-size: 18px;
    line-height: 25px;
    margin-right: 24px;
  }
  &-icon {
  }
}
</style>
