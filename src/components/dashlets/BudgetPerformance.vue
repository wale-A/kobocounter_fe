<template>
  <Card title="Budget Performance" :loading="loading" :error="error">
    <GuageChart v-if="!!data?.length" :budget="data" />
    <section v-else style="padding: 10% 5%">
      <p>
        You have not created a budget for this month.
        <br />
        Create one now to see your budget performance.
      </p>
      <br />
      <router-link to="Budgets" class="button">
        <span class="">Manage Your Budget</span>
      </router-link>
    </section>
  </Card>
</template>

<script lang="ts">
import Card from "@/components/layout/Card.vue";
import { Options, Vue } from "vue-class-component";

import GuageChart from "@/components/charts/GuageChart.vue";

@Options({
  components: {
    Card,
    GuageChart,
  },
  props: {
    height: String,
    data: {
      type: Array,
      required: true,
    },
    loading: Boolean,
    error: Error,
  },
})
export default class BudgetPerformance extends Vue {
  loading?: boolean;
  error?: unknown;
}
</script>

<style scoped>
.button {
  border: 1px solid #007cff;
  border-radius: 10px;
  margin-top: 1.5em;
  padding: 0.4em 1.5em;
  font-size: 1em;
  display: block;
  width: fit-content;
}
</style>
