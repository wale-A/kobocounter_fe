<template>
  <div class="budget">
    <div class="budget__header">
      <h2 class="budget__title">
        <button class="budget__nav" @click="$router.push({ path: '/Budgets' })">
          <svg-icon
            :src="require('@/assets/svg/back.svg')"
            class="filter__trigger-icon"
          />
        </button>
        <span>Budget Details</span>
      </h2>
      <p class="budget__subtitle">This budget is active and cannot be edited</p>
    </div>
    <div class="budget__detail">
      <Field label="Budgeted Amount" :value="budget.value" orientation="row" />
      <Field
        label="Actual Spend"
        :value="budget.amountSpent"
        orientation="row"
      />
      <Field
        label="Status"
        :value="budget.status || 'Active'"
        orientation="row"
      />
      <Field label="Performance" :value="budget.insight" orientation="row" />
      <Field label="Start Date" :value="budget.startDate" orientation="row" />
      <Field label="End Date" :value="budget.endDate" orientation="row" />
    </div>
    <div
      v-if="budget.items && budget.items.length > 0"
      class="budget__category"
    >
      <h3 class="budget__category-title">Budget Categories</h3>
      <Field
        v-for="item in budget.items"
        :key="item.category"
        :label="item.category"
        :value="item.value"
        orientation="row"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Field from "./_internal/Field.vue";
import { format } from "date-fns";

@Options({
  components: {
    Field,
  },
  props: {
    budget: Object,
  },
})
export default class View extends Vue {}
</script>

<style lang="scss" scoped>
@import "@/styles/mixins.scss";
.budget {
  @at-root #{&}__header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 16px;
    color: #2a2a2a;
  }
  @at-root #{&}__nav {
    background: transparent;
    border: none;
    text-align: left;
    margin-right: 10px;
    @include for-size(tablet-landscape-up) {
      margin-right: unset;
      display: none;
    }
  }
  @at-root #{&}__title {
    font-weight: 700;
    font-size: 18px;
    line-height: 25px;
    margin-bottom: 3px;
    color: #2a2a2a;
  }
  @at-root #{&}__subtitle {
    font-size: 14px;
    line-height: 19px;
  }
  @at-root #{&}__detail {
    margin-bottom: 28px;
  }
  @at-root #{&}__category-title {
    font-weight: 700;
    font-size: 12px;
    line-height: 16px;

    color: #364156;
    margin-bottom: 9px;
  }
}
</style>
