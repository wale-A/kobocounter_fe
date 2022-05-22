<template>
  <Card title="Top 3 Expense categories">
    <div class="expense">
      <table class="expense__table">
        <tr class="expense__header">
          <th
            v-for="(title, index) in [
              'Category',
              'Amount (N)',
              '% of total expenses',
            ]"
            :key="title"
            class="expense__header-item"
            :class="{ 'expense__header-item--right': index == 1 || index == 2 }"
          >
            {{ title }}
          </th>
        </tr>
        <tr v-for="item in data" :key="item.category" class="expense__record">
          <td class="expense__record-item expense__record-item--left">
            {{ item.category }}
          </td>
          <td class="expense__record-item">N{{ Math.abs(item.amount) }}</td>
          <td class="expense__record-item">{{ item.percentage }}%</td>
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
      required: true,
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
