<template>
  <div class="insight">
    <h2>{{ insight.category }}</h2>
    <div>
      <h4>Total Amount</h4>
      <h2>{{ insight.amount }}</h2>
      <progress
        max="100"
        :value="div(insight.amount, insight.budgetAmount) * 100"
        class="insight__progress-bar"
      ></progress>
      <span
        >You have spent N{{ insight.amount }} out of your N{{
          insight.budgetAmount
        }}
        budget on groceries for the month</span
      >
    </div>
    <div>
      <span>Spending trend on Groceries in the last 6 months</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  props: {
    insight: Object,
    data: Object,
  },
})
export default class View extends Vue {
  div(num: number, denum: number): number {
    if (denum === 0) {
      return 0;
    }
    return num / denum;
  }
}
</script>
