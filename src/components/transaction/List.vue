<template>
  <Card :title="title" class="transaction--no-shadow">
    <div class="transaction">
      <table class="transaction__list">
        <tr v-for="date in Object.keys(transactions)" :key="date">
          <p class="transaction__date">{{ date }}</p>
          <table class="transaction__group">
            <tr
              v-for="txn in transactions[date]"
              :key="txn.id"
              :id="txn.id"
              class="transaction__group-item"
              :class="{
                'transaction__group-item--active': txn.id === active,
              }"
              @click.stop="selectTransaction(txn.id)"
            >
              <td class="transaction__category">
                <span class="transaction__category-item">
                  <img
                    :alt="`${getCategory(txn)}`"
                    :src="getIcon(txn)"
                    class="transaction__category-icon"
                    onerror="this.style.display='none';"
                  />
                  <span class="transaction__category-name"
                    >{{ getCategory(txn) }}
                  </span>
                </span>
              </td>
              <td class="transaction__price">
                <span
                  :style="{
                    color: isPositive(txn) ? 'green' : 'red',
                  }"
                >
                  {{ getAmount(txn) }}
                </span>
              </td>
            </tr>
          </table>
        </tr>
      </table>
      <div v-if="canLoadMore" class="transaction__pager">
        <button
          :disabled="loadingMore"
          class="transaction__pager-trigger"
          @click="$emit('loadMore')"
        >
          Load More
        </button>
      </div>
    </div>
  </Card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Card from "@/components/layout/Card.vue";
import { Transaction } from "@/types";

@Options({
  components: {
    Card,
  },
  props: {
    highlight: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      default: "All Transactions",
    },
    transactions: {
      type: Array,
      required: true,
    },
    canLoadMore: {
      type: Boolean,
      required: true,
    },
    loadingMore: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    highlight(newVal) {
      this.active = newVal;
    },
  },
})
export default class List extends Vue {
  active = "";

  selectTransaction(id: string): void {
    this.active = id;
    this.$emit("select", id);
  }

  getCategory(transaction: Transaction): string {
    return (
      transaction.expenseCategory ||
      transaction.displayCategory ||
      "null"
    ).trim();
  }

  getIcon(transaction: Transaction): string {
    const category = this.getCategory(transaction);
    return `/img/categories/${category.toLowerCase()}.svg`;
  }

  getAmount(transaction: Transaction): string {
    const amount = transaction.amount || transaction.displayAmount || 0;
    return parseFloat(amount.toFixed(2)).toLocaleString();
  }

  isPositive(transaction: Transaction): boolean {
    const amount = transaction.amount || transaction.displayAmount || 0;
    return amount > 0;
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/mixins.scss";
.transaction {
  font-size: 12px;
  color: #364156;

  @at-root #{&}--no-shadow {
    @media (max-width: 991px) {
      box-shadow: none;
    }
  }

  @at-root #{&}__date {
    padding: 0.5rem 0;
    border-bottom: 1px solid #727376;
    text-align: start;
    font-size: 0.9rem;
    font-weight: 800;
    margin-top: 0.5rem;
  }

  @at-root #{&}__group {
    border-collapse: collapse;
  }

  @at-root #{&}__group-item {
    border-bottom: 1px solid #d9dbdb;
    font-weight: 600;
    font-size: 12px;
    line-height: 16px;
    @include for-size(tablet-landscape-up) {
      font-weight: 600;
      font-size: 14px;
      line-height: 19px;
    }
  }

  @at-root #{&}__group-item--active {
    background: #d9dbdb;
  }

  @at-root #{&}__category {
    width: 80%;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: start;
    font-weight: 700;
    padding: 0.5rem 0;
  }

  @at-root #{&}__category-item {
    display: flex;
    align-items: center;
    min-height: 25px;
  }

  @at-root #{&}__category-icon {
    max-height: 25px;
    max-width: 25px;
    margin-right: 5px;
  }

  @at-root #{&}__price {
    text-align: end;
    padding: 0.5rem 0;
  }

  @at-root #{&}__pager {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }

  @at-root #{&}__pager-trigger {
    border: 1px solid #007cff;
    background: white;
    color: #007cff;
    padding: 0.5rem;

    &:hover,
    &:focus {
      background: #007cff;
      color: white;
    }
  }
}
</style>
