<template>
  <Card title="Budget Performance">
    <GuageChart v-show="data?.length" :budget="data" />
    <section v-show="!data?.length" style="padding: 3%">
      <p>
        You haven't created a budget for this month.
        <br />
        Create one now to see your budget performance.
      </p>
      <br />
      <router-link to="Budget" class="button">
        <span class="">Create Your Budget</span>
      </router-link>
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
    data: {
      type: Array,
      required: true,
    },
  },
})
export default class BudgetPerformance extends Vue {}
</script>
