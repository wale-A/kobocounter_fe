<template>
  <Card title="Upcoming Expenses" :subtitle="getDateRange()">
    <div class="expense">
      <table class="expense__table">
        <tr class="expense__header">
          <th
            v-for="(title, index) in ['Narration', 'Amount (N)']"
            :key="title"
            class="expense__header-item"
            :class="{ 'expense__header-item--right': index > 0 }"
          >
            {{ title }}
          </th>
        </tr>
        <tr
          v-for="item in expenses"
          :key="item.narration"
          class="expense__record"
        >
          <td
            class="expense__record-item expense__record-item--left"
            :title="item.narration"
          >
            {{ parseNarration(item.narration) }}
          </td>
          <td class="expense__record-item">
            {{ getAmount(item.transactions || []) }}
          </td>
        </tr>
        <tr v-if="!expenses?.length">
          <td>We are not aware of any upcoming expense for this period.</td>
        </tr>
      </table>
    </div>
  </Card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Card from "@/components/layout/Card.vue";
import { RecurrentExpense, Transaction } from "@/types";
import { sub, add } from "date-fns";

@Options({
  components: {
    Card,
  },
  props: {
    expenses: {
      type: Array,
      required: true,
    },
  },
})
export default class UpcomingExpenses extends Vue {
  expenses?: RecurrentExpense[];

  parseNarration(narration: string): string {
    const text = narration
      .replace(/\d{2,}/g, "")
      .replace(/_/g, " ")
      .replace(/\s{2,}/g, " ")
      .replace(/VISA/g, "")
      .trim();

    return text.length > 28 ? text.slice(0, 25) + " ..." : text;
  }

  getAmount(transactions: Transaction[]): string {
    return Math.abs(
      transactions.reduce((acc, x) => (acc += x.amount), 0) /
        (transactions.length || 1)
    ).toLocaleString();
  }

  getDateRange(): string {
    const minDate = sub(new Date(), { days: 3 });
    const maxDate = add(new Date(), { days: 3 });

    return ` between ${minDate.getFullYear()}-${(minDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${minDate
      .getDate()
      .toString()
      .padStart(2, "0")} and ${maxDate.getFullYear()}-${(maxDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${maxDate.getDate().toString().padStart(2, "0")}`;
  }
}
</script>

<style lang="scss" scoped>
.expense {
  font-size: 13px;
  line-height: 16px;
  color: #364156;

  @at-root #{&}__table {
    border-collapse: collapse;
    margin-bottom: 10px;
  }

  @at-root #{&}__header {
    font-weight: 700;
    text-align: left;
    border-bottom: 1px solid rgba(42, 42, 42, 0.15);
  }

  @at-root #{&}__header-item {
    padding: 7px 0;
  }

  @at-root #{&}__header-item--right {
    text-align: right;
  }

  @at-root #{&}__record {
    text-align: right;
  }

  @at-root #{&}__record-item {
    font-weight: 600;
    padding: 10px 0;
  }

  @at-root #{&}__record-item--left {
    text-align: left;
  }
}
</style>
