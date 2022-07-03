<template>
  <div class="insight">
    <div class="insight__header">
      <button class="insight__nav" @click="$router.push({ path: '/Insights' })">
        <svg-icon
          :src="require('@/assets/svg/back.svg')"
          class="filter__trigger-icon"
        />
      </button>
      <h2 class="insight__category">{{ insight.category }}</h2>
    </div>
    <div class="insight__detail">
      <h4 class="insight__amount-label">Total Amount</h4>
      <h2 class="insight__amount">{{ insight.amount.toLocaleString() }}</h2>
      <progress
        max="100"
        :value="div(insight.amount, insight.budgetAmount) * 100"
        class="insight__progress-bar"
      ></progress>
      <span class="insight__breakdown"
        >You have spent
        <strong>N{{ insight.amount.toLocaleString() }}</strong> out of your
        <strong>N{{ (insight.budgetAmount || 0).toLocaleString() }}</strong>
        budget on groceries for the month</span
      >
    </div>
    <div v-if="data" class="insight__history">
      <BudgetHistory :data="data" />
      <div class="insight__trend">
        <span
          >Spending trend on <b>{{ insight.category }}</b> in the last 6
          months</span
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import BudgetHistory from "@/components/charts/BudgetHistory.vue";

@Options({
  components: {
    BudgetHistory,
  },
  props: {
    insight: Object,
    data: Object,
  },
})
export default class View extends Vue {
  div(num: number, denum: number): number {
    if (!denum) {
      return 0.4;
    }
    return num / denum;
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/mixins.scss";
.insight {
  @at-root #{&}__header {
    display: flex;
    align-items: center;
  }
  @at-root #{&}__nav {
    background: transparent;
    border: none;
    text-align: left;
    margin-right: 10px;
    @include for-size(tablet-landscape-up) {
      display: none;
    }
  }
  @at-root #{&}__category {
    color: black;
    font-size: 25px;
    margin-bottom: 30px;
    margin-top: 21px;
  }

  @at-root #{&}__amount-label {
    font-size: 14px;
    line-height: 19px;
    color: #2a2a2a;
  }

  @at-root #{&}__amount {
    font-weight: 700;
    font-size: 24px;
    line-height: 33px;
    color: #2a2a2a;
    margin-bottom: 9px;
  }

  @at-root #{&}__progress-bar {
    display: block;
    width: 100%;
    margin-bottom: 14px;
  }

  progress::-webkit-progress-bar {
    background-color: #cce4ff;
  }

  @at-root #{&}__breakdown {
    font-size: 12px;
    line-height: 16px;
    color: #2a2a2a;
  }

  @at-root #{&}__trend {
    font-size: 13px;
    font-weight: 400;
    line-height: 18px;
  }
}
</style>
