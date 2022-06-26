<template>
  <Card title="Account activity">
    <IncomeChart
      :width="'98%'"
      :fileName="filename"
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
    revenue: String,
    expense: String,
    fileName: String,
  },
})
export default class AccountActivity extends Vue {}
</script>
