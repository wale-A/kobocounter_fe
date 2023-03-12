<template>
  <Card title="Account Summary" :loading="loading" :error="error">
    <div class="summary">
      <div class="summary__balance">
        <span class="summary__key">Your balance</span>
        <span class="summary__value">N{{ accountBalance }}</span>
      </div>
      <div class="summary__group">
        <div class="summary__item">
          <img class="summary__icon" src="/img/assets/income.png" />
          <div class="summary__desc">
            <p class="summary__key">Income</p>
            <p class="summary__value">N{{ totalRevenue }}</p>
          </div>
        </div>
        <div class="summary__item">
          <img class="summary__icon" src="/img/assets/expense.png" />
          <div class="summary__desc">
            <p class="summary__key">Expenses</p>
            <p class="summary__value">N{{ totalExpenses }}</p>
          </div>
        </div>
      </div>
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
    accountBalance: String,
    totalRevenue: String,
    totalExpenses: String,
    loading: Boolean,
    error: Error,
  },
})
export default class AccountSummary extends Vue {}
</script>

<style lang="scss" scoped>
.summary {
  font-size: 12px;
  color: #364156;

  @at-root #{&}__balance {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 1px solid #0051a6;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 20px;
  }

  @at-root #{&}__group {
    display: flex;
  }

  @at-root #{&}__icon {
    margin-right: 8px;
    width: 30px;
    height: 30px;
  }

  @at-root #{&}__item {
    display: flex;
    padding: 7px;
    width: 50%;
  }

  @at-root #{&}__desc {
    display: flex;
    flex-direction: column;
  }

  @at-root #{&}__value {
    font-weight: 600;
    font-size: 16px;
  }
}
</style>
