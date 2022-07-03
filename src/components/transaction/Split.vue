<template>
  <div class="transaction">
    <div class="transaction__header">
      <button class="transaction__nav" @click="$router.go(-1)">
        <svg-icon
          :src="require('@/assets/svg/back.svg')"
          class="transaction__nav-icon"
        />
      </button>
      <div class="transaction__title">Split Transaction</div>
    </div>
    <div class="transaction__sub-header">
      <div class="transaction__sub-title">Total Amount:</div>
      <div class="transaction__amount">
        N
        <span>
          {{ Math.abs(transaction?.amount).toLocaleString() }}
        </span>
      </div>
    </div>
    <div class="transaction__info">
      <svg-icon
        :src="require('@/assets/svg/info.svg')"
        class="transaction__info-icon"
      /><span class="transaction__info-text"
        >The total of each split amount should be equal to the total of the
        initial transaction.</span
      >
    </div>
    <form class="transaction__form">
      <div
        class="transaction__field-group"
        v-for="(item, index) in model"
        :key="index"
      >
        <div class="transaction__field-group-item">
          <label class="transaction__field-label">Expense Category</label>
          <Multiselect
            v-model="item.expenseCategory"
            :searchable="true"
            :options="categories"
            noResultsText="No result found"
            class="transaction__field-input"
          />
        </div>
        <div class="transaction__field-group-item">
          <label class="transaction__field-label">Enter Amount</label>
          <input
            v-model="item.amount"
            type="number"
            class="transaction__field-input"
            min="0"
          />
          <button
            v-if="index > 0"
            class="transaction__field-action"
            @click.stop="remove(index)"
          >
            <svg-icon
              :src="require('@/assets/svg/del.svg')"
              class="transaction__input-icon"
            />
          </button>
        </div>
      </div>

      <button class="transaction__append" @click.prevent="add">
        + Add New Split
      </button>
      <br />
      <span
        v-if="splitTransactionTotal > Math.abs(transaction.amount)"
        style="
          color: red;
          display: block;
          text-align: center;
          margin-bottom: 0.5em;
        "
      >
        the total amount cannot be greater than the transaction amount</span
      >
      <!-- <div id="split-transaction-summary">
            <p>Split total: {{ splitTransactionTotal }}</p>
            <p>
              Amount left:
              {{ Math.abs(transaction.amount) - splitTransactionTotal }}
            </p>
          </div> -->
      <div class="transaction__actions">
        <input
          type="button"
          value="SUBMIT"
          :disabled="!canSubmit"
          class="button button--primary"
          :class="{ 'button--disabled': !canSubmit }"
          @click.stop="$emit('saveSplit', model)"
        />
        <input
          type="button"
          class="button button--secondary"
          value="CANCEL"
          @click.stop="$emit('cancel')"
        />
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Multiselect from "@vueform/multiselect";
import { EXPENSE_CATEGORIES } from "@/config";
import { SplitTransaction, Transaction } from "@/types";

@Options({
  components: { Multiselect },
  props: {
    transaction: {
      type: Object,
      required: true,
    },
    sub: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      model: [{ expenseCategory: "", amount: null, id: "" }],
    };
  },
  computed: {
    splitTransactionTotal() {
      return this.model.reduce(
        (acc: number, item: { amount: number | null }) => {
          return acc + (item.amount || 0);
        },
        0
      );
    },
    categories() {
      return EXPENSE_CATEGORIES;
    },
    canSubmit() {
      return (
        this.model.every(
          (x: SplitTransaction) => x.expenseCategory && x.amount
        ) && this.splitTransactionTotal <= Math.abs(this.transaction.amount)
      );
    },
  },
  methods: {
    add() {
      this.model.push({
        expenseCategory: "",
        amount: null,
        id: "",
      });
    },
    remove(index: number) {
      this.model.splice(index, 1);
    },
  },
  created() {
    if (this.sub.length) {
      this.model = this.sub.map((x: Transaction) => {
        return {
          expenseCategory: x.expenseCategory,
          amount: Math.abs(x.displayAmount || 0),
          id: x.id,
        };
      });
    }
  },
})
export default class Split extends Vue {}
</script>

<style lang="scss" scoped>
.transaction {
  @at-root #{&}__header {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
  }
  @at-root #{&}__nav {
    background: transparent;
    border: none;
    text-align: left;
    margin: 0 12px 0 0;
  }
  @at-root #{&}__title {
    font-weight: 700;
    font-size: 18px;
    line-height: 25px;
  }
  @at-root #{&}__sub-header {
    margin-bottom: 10px;
  }
  @at-root #{&}__sub-title {
    font-weight: 600;
    font-size: 14px;
    line-height: 19px;
  }
  @at-root #{&}__amount {
    font-weight: 700;
    font-size: 24px;
    margin-bottom: 10px;
  }
  @at-root #{&}__info {
    display: flex;
    background: #f1f4f7;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 24px;
  }
  @at-root #{&}__info-icon {
    margin-right: 10px;
  }
  @at-root #{&}__info-text {
    font-size: 12px;
    line-height: 18px;
  }
  @at-root #{&}__field-group {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
  }
  @at-root #{&}__field-group-item {
    width: 45%;
    position: relative;
  }
  @at-root #{&}__field-label {
    font-weight: 600;
    font-size: 12px;
    line-height: 16px;
    margin-bottom: 4px;
  }
  @at-root #{&}__field-input {
    max-width: 100%;
  }
  @at-root #{&}__field-action {
    background: transparent;
    border: none;
    text-align: left;
    position: absolute;
    top: 58%;
    left: 75%;
  }

  @at-root #{&}__append {
    background: transparent;
    border: none;
    text-align: center;
    font-size: 12px;
    line-height: 16px;
    color: #007cff;
    width: 100%;
  }

  @at-root #{&}__actions {
    margin-top: 2em;
    display: flex;
    flex-direction: column;
  }
}

.button {
  font-weight: 700;
  font-size: 14px;
  line-height: 19px;
  border: 1px solid #007cff;
  background: white;
  border-radius: 5px;
  color: #007cff;
  width: 100%;
  padding: 1em;
  width: unset;
  height: unset;

  @at-root #{&}--primary {
    background: #007cff;
    color: white;
    margin-bottom: 14px;
  }
}
</style>
