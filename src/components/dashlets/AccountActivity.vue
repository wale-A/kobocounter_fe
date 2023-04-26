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
import IncomeChart from "@/components/charts/IncomeChart.vue";
import Card from "@/components/layout/Card.vue";
import { Options, Vue } from "vue-class-component";

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
export default class AccountActivity extends Vue {
  loading?: boolean;
  error?: string;
  fileName?: string;
  revenue?: unknown[];
  expense?: unknown[];
}
</script>
