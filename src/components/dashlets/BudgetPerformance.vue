<template>
  <Card title="Budget Performance">
    <GuageChart
      :budgetSummary="[
        {
          category: 'Budget Spent',
          value: 70,
        },
        { category: 'Budget Left', value: 30 },
      ]"
      :budgetDetails="[
        { category: 'Food', value: 30, amount: 30000 },
        { category: 'Transport', value: 20, amount: 20000 },
        { category: 'Airtime & Data', value: 15, amount: 15000 },
        { category: 'Fuel', value: 5, amount: 5000 },
        {
          category: 'Budget Left',
          value: 30,
          amount: 30000,
        },
      ]"
      v-show="true"
    />

    <section v-show="false">
      <p>
        You haven't created a budget for this month. Create one now to see your
        budget performance.
      </p>
      <form @submit.prevent="$emit('addAccount')">
        <input type="submit" value="Create Your Budget" />
      </form>
    </section>
  </Card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Card from "@/components/layout/Card.vue";

import GuageChart from "@/components/charts/GuageChart.vue";

@Options({
  components: {
    Card,
    GuageChart,
  },
  props: {
    height: String,
  },
})
export default class BudgetPerformance extends Vue {}
</script>
