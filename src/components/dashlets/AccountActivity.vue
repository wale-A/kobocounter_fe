<template>
  <Card title="Account Activity" :loading="loading" :error="error">
    <IncomeChart
      :width="'98%'"
      :fileName="fileName"
      :revenue="revenue"
      :expense="expense"
    />
    <!-- :netIncome="netIncome" -->
  </Card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Card from "@/components/layout/Card.vue";
import IncomeChart from "@/components/charts/IncomeChart.vue";

@Options({
  components: {
    Card,
    IncomeChart,
  },
  props: {
    revenue: Array,
    expense: Array,
    fileName: String,
    loading: Boolean,
    error: Error,
  },
})
export default class AccountActivity extends Vue {}
</script>
