<template>
  <div>
    <!-- TODO: format date/time ---->
    <Header
      :alt="`${transaction?.bank} logo`"
      :src="`/img/banks/${transaction?.bank}.svg`"
      :date="date"
      :time="time"
      class="transaction__header"
    />
    <div class="transaction__body">
      <Field
        label="transaction category:"
        :value="transaction?.displayCategory?.trim()"
      />
      <!-- TODO: format currency ---->
      <Field label="amount:">
        <template #value>
          <label>
            <span style="font-weight: 800; font-size: large">&#8358; </span>
            <span
              :style="{
                'font-weight': 500,
                color:
                  (transaction?.amount || transaction?.displayAmount) < 0
                    ? 'rgba(255, 10, 10, 0.7)'
                    : 'rgb(20, 180, 20)',
              }"
            >
              {{
                Math.abs(
                  transaction?.amount || transaction?.displayAmount
                ).toLocaleString()
              }}
            </span>
          </label>
        </template>
      </Field>

      <Field label="recipient:" :value="transaction?.recipient" />

      <Field
        label="business activity:"
        :value="transaction?.establishment?.activities?.join(', ')?.trim()"
      />

      <Field label="expense category:" :value="transaction?.expenseCategory" />

      <Field label="narration:" :value="transaction?.narration" />

      <div v-if="sub && sub.length">
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
      </div>

      <div v-if="parent">
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
      </div>
    </div>
  </div>

  <div class="form-buttons">
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
import { Options, Vue } from "vue-class-component";
import Header from "./_internal/Header.vue";
import Field from "./_internal/Field.vue";
import { formatDate, formatTime } from "@/util";

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
export default class View extends Vue {}
</script>

<style lang="scss" scoped>
.transaction__body {
  margin-top: 2em;
}
.form-buttons {
  margin-top: 2em;
  display: flex;
  justify-content: space-around;
}
.button {
  font-weight: 800;
  border: 1px solid #007cff;
  background: white;
  color: #007cff;
  min-width: 150px;
  padding: 1em;

  &--primary {
    background: #007cff;

    color: white;
  }
}

ul {
  list-style-type: disclosure-closed;
}
@media screen and (max-width: 991px) {
  .form-buttons {
    display: flex;
    margin-top: unset;
  }
}
</style>
