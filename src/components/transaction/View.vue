<template>
  <div class="transaction">
    <!-- TODO: format date/time ---->
    <div class="transaction__header">
      <button
        class="transaction__nav"
        @click="$router.push({ name: 'TransactionList' })"
      >
        <svg-icon
          :src="'/img/assets/svg/back.svg'"
          class="filter__trigger-icon"
        />
      </button>
      <div class="transaction__bank">{{ transaction?.bank }}</div>
      <div class="transaction__amount">
        N{{
          Math.abs(
            transaction?.amount || transaction?.displayAmount
          ).toLocaleString()
        }}
      </div>
      <div class="transaction__date">{{ `${date} ${time}` }}</div>
    </div>
    <div class="transaction__body">
      <Field label="Expense Category:" :value="transaction?.expenseCategory" />
      <Field
        label="Transaction Category:"
        :value="transaction?.displayCategory?.trim()"
      />
      <Field label="Recipient:" :value="transaction?.recipient" />
      <Field label="Narration:">
        <template #value>
          <div class="transaction--small-text">
            {{ transaction?.narration }}
          </div>
        </template>
      </Field>

      <!--Field
        label="business activity:"
        :value="transaction?.establishment?.activities?.join(', ')?.trim()"
      /-->

      <!--div v-if="sub && sub.length">
        <Field label="sub transactions:">
          <template #value>
            <ul style="margin-bottom: 0.5em">
              <li v-for="txn in sub" :key="txn.id">
                <a
                  href="#"
                  class="sub-transaction"
                  @click.stop="$emit('select', txn.id)"
                >
                  {{ txn.expenseCategory }} - &#8358;{{
                    Math.abs(txn.displayAmount)
                  }}
                </a>
                <br />
              </li>
            </ul>
          </template>
        </Field>
      </div-->

      <!--div v-if="parent">
        <Field label="parent transaction:">
          <template #value>
            <ul style="margin-bottom: 0.5em">
              <li>
                <a
                  href="#"
                  class="sub-transaction"
                  @click.stop="$emit('select', parent.id)"
                >
                  {{ parent.displayCategory }} - &#8358;{{
                    Math.abs(parent.amount)
                  }}
                </a>
                <br />
              </li>
            </ul>
          </template>
        </Field>
      </div-->
    </div>
  </div>

  <div class="transaction__actions">
    <button
      v-if="canEdit"
      class="button button--primary"
      @click.stop="$emit('edit', expense)"
    >
      Edit Transaction
    </button>
    <button
      v-if="canSplit"
      class="button button--secondary"
      @click.stop="$emit('split', expense)"
    >
      Split Transaction
    </button>
  </div>
</template>

<script lang="ts">
import { Transaction } from "@/types";
import { formatDate, formatTime } from "@/util";
import { Options, Vue } from "vue-class-component";
import Field from "./_internal/Field.vue";
import Header from "./_internal/Header.vue";

@Options({
  components: { Field, Header },
  emits: ["edit", "split", "select"],
  props: {
    transaction: Object,
    parent: Object,
    sub: Array,
  },
  computed: {
    canEdit() {
      return !["Bank Charge", "Inflow"].includes(
        this.transaction?.displayCategory
      );
    },
    canSplit() {
      return (
        !["Bank Charge", "Inflow"].includes(
          this.transaction?.displayCategory
        ) && !this.transaction?.parentId
      );
    },
    date() {
      return formatDate(this.transaction?.date);
    },
    time() {
      return formatTime(this.transaction?.date);
    },
  },
})
export default class View extends Vue {
  isPositive(transaction: Transaction): boolean {
    const amount = transaction.amount || transaction.displayAmount || 0;
    return amount > 0;
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/mixins.scss";
.transaction {
  @at-root #{&}--small-text {
    font-size: 12px;
    line-height: 20px;
  }
  @at-root #{&}__header {
    display: flex;
    flex-direction: column;
    margin-bottom: 30px;
  }
  @at-root #{&}__nav {
    background: transparent;
    border: none;
    text-align: left;
    @include for-size(tablet-landscape-up) {
      display: none;
    }
  }
  @at-root #{&}__bank {
    font-weight: 600;
    font-size: 14px;
    line-height: 19px;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
  @at-root #{&}__amount {
    font-weight: 700;
    font-size: 32px;
  }
  @at-root #{&}__date {
    font-size: 12px;
    line-height: 16px;
  }
  @at-root #{&}__body {
    margin-top: 2em;
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

  @at-root #{&}--primary {
    background: #007cff;
    color: white;
    margin-bottom: 19px;
  }
}

ul {
  list-style-type: disclosure-closed;
}
</style>
