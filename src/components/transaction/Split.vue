<template>
  <div id="split-transaction">
    <div
      id="split-header"
      style="
        padding: 0 1em 0.5em;
        margin-bottom: 1.5em;
        border-bottom: 1px solid #ddd;
        text-align: center;
      "
    >
      <h3>Split transaction</h3>
      <p>
        Total Amount:
        <span style="">&#8358;</span>
        <span>
          {{ Math.abs(transaction?.amount).toLocaleString() }}
        </span>
      </p>
    </div>
    <p class="small-text">
      The total of each split amount should be equal to the total of the initial
      transaction. Adjust the amount already entered or use the button below to
      add a new split.
    </p>
    <form id="transaction-split-form">
      <div
        class="split-item-container"
        v-for="(item, index) in model"
        :key="index"
      >
        <div class="split-item">
          <p class="mid-text" style="margin-top: 0.5em">category</p>
          <Multiselect
            placeholder="Select an expense category"
            v-model="item.expenseCategory"
            :searchable="true"
            :options="categories"
            noResultsText="No result found"
          />

          <p>amount</p>
          <input
            type="number"
            style="height: 2.5em; padding: 0.5em 1em; color: black"
            min="0"
            v-model="item.amount"
          />
          <!-- :style="{
                  borderColor:
                    (item?.amount || 0) > Math.abs(simgleTransaction.amount)
                      ? 'red'
                      : 'black', -->
          <!-- }" -->
        </div>
        <span
          v-if="index > 0"
          class="material-icons delete-split-item"
          style="margin-top: 2em; color: red"
          @click.stop="remove(index)"
        >
          delete
        </span>
      </div>

      <button
        style="
          font-size: 0.9em;
          background-color: transparent;
          border: none;
          display: block;
          text-align: center;
          padding: 1em;
          width: 100%;
          cursor: pointer;
          margin-top: 1em;
          color: #007cff;
          padding-bottom: 0;
        "
        @click.prevent="add"
      >
        <span>+ Add New Split</span>
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
      <div class="form-buttons">
        <input
          type="button"
          style="width: unset !important; height: unset !important"
          value="SUBMIT"
          :disabled="!canSubmit"
          class="button button--primary"
          :class="{ 'button--disabled': !canSubmit }"
          @click.stop="$emit('saveSplit', model)"
        />
        <input
          type="button"
          class="button"
          style="width: unset !important; height: unset !important"
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
form {
  margin-top: 2em;
}
#split-transaction-summary {
  text-align: center;
}
.form-buttons {
  margin-top: 2em;
  display: flex;
  justify-content: space-around;

  .button {
    font-weight: 800;
    border: 1px solid #007cff;
    background: white;
    color: #007cff;
    min-width: 150px;
    cursor: pointer;
    margin: 0;
    font-size: 1em;
    padding: 1em;

    border-radius: 5px;

    &--primary {
      background: #007cff;
      color: white;
    }

    &--disabled {
      background: grey;
    }
  }
}
button {
  font-weight: 800;
  border: 1px solid #007cff;
}
p span:first-child {
  font-weight: 700;
}
form input {
  height: 1.5em;
}

.split-item-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1em;
  padding-bottom: 1em;
}

.split-item {
  width: 85%;
}
.split-item input {
  width: 100%;
}
.split-item p {
  margin-top: 0.5em;
}

.delete-split-item {
  cursor: pointer;
}
ul {
  list-style-type: disclosure-closed;
}
@media screen and (max-width: 991px) {
  .form-buttons {
    display: flex;
    margin-top: unset;
  }
  form p {
    margin-top: 1em;
    padding-top: 0;
  }
  label input {
    display: inline;
  }
}
</style>
