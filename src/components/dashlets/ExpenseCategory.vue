<template>
  <Card title="Top 3 Expense categories">
    <div class="expense">
      <table class="expense__table">
        <tr class="expense__header">
          <th
            v-for="title in ['Category', 'Amount (N)', '% of total expenses']"
            :key="title"
            class="expense__header-item"
          >
            {{ title }}
          </th>
        </tr>
        <tr v-for="item in data" :key="item.category" class="expense__record">
          <td class="expense__record-item expense__record-item--left">
            {{ item.category }}
          </td>
          <td class="expense__record-item">{{ item.amount }}</td>
          <td class="expense__record-item">{{ item.fraction }}%</td>
        </tr>
      </table>
    </div>
  </Card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Card from "@/components/layout/Card.vue";

@Options({
  components: {
    Card,
  },
  props: {
    data: {
      type: Array,
      default: () => [
        { category: "Food & Drinks", amount: 8000, fraction: 30 },
        { category: "Transportation", amount: 12000, fraction: 25 },
        { category: "Airtime & Data", amount: 7000, fraction: 15 },
      ],
    },
  },
})
export default class ExpenseCategory extends Vue {}
</script>

<style lang="scss" scoped>
.expense {
  font-size: 12px;
  line-height: 16px;
  color: #364156;

  @at-root #{&}__table {
    border-collapse: collapse;
  }

  @at-root #{&}__header {
    font-weight: 700;
    text-align: left;
    border-bottom: 1px solid rgba(42, 42, 42, 0.15);
  }

  @at-root #{&}__record {
    font-weight: 600;
    text-align: right;
  }

  @at-root #{&}__record-item--left {
    text-align: left;
  }
}
</style>
