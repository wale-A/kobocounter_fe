<template>
  <div class="insight">
    <h2>{{ insight.category }}</h2>
    <div>
      <h4>Total Amount</h4>
      <h2>{{ insight.amount.toLocaleString() }}</h2>
      <progress
        max="100"
        :value="div(insight.amount, insight.budgetAmount) * 100"
        class="insight__progress-bar"
      ></progress>
      <span
        >You have spent
        <strong>N{{ insight.amount.toLocaleString() }}</strong> out of your
        <strong>N{{ (insight.budgetAmount || 0).toLocaleString() }}</strong>
        budget on groceries for the month</span
      >
    </div>

    <BudgetHistory v-if="insight" :data="data" />
    <div style="margin-top: 1em">
      <span
        >Spending trend on <b>{{ insight.category }}</b> in the last 6
        months</span
      >
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
      return 0;
    }
    return num / denum;
  }
}
</script>

<style scoped>
h2 {
  color: black;
  font-size: 25px;
  margin-bottom: 15px;
  margin-top: 5px;
}
h4 {
  margin-top: 25px;
}
progress {
  display: block;
  width: 100%;
  margin-bottom: 15px;
}
</style>
