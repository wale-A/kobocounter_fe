<template>
  <main class="dashboard">
    <SideBar :section="'transactions'" />
    <section class="dashboard-content-container">
      <Header />
      <div class="dashboard-content">
        <div class="all-transactions bordered-container">
          <p class="bold-text">All Transactions</p>
          <hr />
          <section id="all-transactions-container">
            <table>
              <tr v-for="date in Object.keys(groupedTransactions)" :key="date">
                <!-- <td colspan="2" style="width: 100%">
                  {{ date }}
                </td> -->
                <p>{{ date }}</p>
                <table class="transactions-table">
                  <tr
                    v-for="txn in groupedTransactions[date]"
                    :key="txn.id"
                    :data-transactionId="txn.id"
                    @click.prevent="transactionClickHandler"
                  >
                    <td>
                      <!-- txn.narration.replace(/\s{4,}/g, "").trim() -->
                      <div>
                        <img
                          :alt="`${txn.expenseCategory || txn.displayCategory}`"
                          :src="`/img/categories/${(
                            txn.expenseCategory ||
                            txn.displayCategory ||
                            'null'
                          ).toLowerCase()}.svg`"
                        />
                        {{ txn.expenseCategory || txn.displayCategory }}
                      </div>
                    </td>
                    <!-- <td class="date">
                      {{ new Date(txn.date).toDateString() }}
                    </td> -->
                    <td>
                      <span
                        :style="{ color: txn.amount > 0 ? 'green' : 'red' }"
                      >
                        {{ parseFloat(txn.amount.toFixed(2)).toLocaleString() }}
                      </span>
                    </td>
                  </tr>
                </table>
              </tr>
            </table>
          </section>
        </div>
      </div>
    </section>
    <AddNewAccount :hasAccounts="!(accounts && accounts?.length == 0)" />
  </main>

  <SingleTransaction
    :singleTransaction="singleTransaction"
    :closeFunction="() => (singleTransaction = undefined)"
  />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { mapGetters } from "vuex";
import Header from "@/components/Header.vue";
import SideBar from "@/components/SideBar.vue";
import AddNewAccount from "@/components/AddNewAccount.vue";
import { sub } from "date-fns";
import { Transaction } from "@/types";
import SingleTransaction from "@/components/SingleTransaction.vue";

@Options({
  created() {
    this.$store.dispatch("getTransactions", {
      accountId: undefined,
      start: undefined,
      end: undefined,
    });
  },
  data() {
    return {
      singleTransaction: null,
    };
  },
  components: {
    SideBar,
    Header,
    AddNewAccount,
    SingleTransaction,
  },
  computed: {
    ...mapGetters(["accounts", "transactions"]),
    groupedTransactions: function () {
      const sortedTransactions = this.transactions?.sort(
        (x: Transaction, y: Transaction) => x.date - y.date
      );
      const group: Record<string, Transaction[]> = {};
      for (let i = 0; i < sortedTransactions?.length || 0; i++) {
        const date = new Date(sortedTransactions[i].date).toDateString();
        const txn = sortedTransactions[i] as Transaction;
        group[date] = (group[date] || []).concat(txn);
      }
      return group;
    },
  },
  methods: {
    getRandomDate() {
      const today = new Date().getTime();
      const thirtyDaysBefore = sub(today, { months: 1 }).getTime();
      return new Date(
        thirtyDaysBefore + Math.random() * (today - thirtyDaysBefore)
      );
    },
    getRandomCategory() {
      const categories = [
        "Food & Drinks",
        "Transportation",
        "Airtime & Data",
        "Groceries",
        "Entertainment",
        "Shopping",
        "Health",
        "Bills",
        "Other",
        "Transfer",
        "ATM Withdrawal",
        "POS Transaction",
        "Bank Charges",
      ];
      return categories[Math.floor(Math.random() * (categories.length - 1))];
    },
    transactionClickHandler(e: Event) {
      const transactionId = (e.currentTarget as any).dataset.transactionid;
      this.singleTransaction = this.transactions.find(
        (x: Transaction) => x.id === transactionId
      );
    },
  },
})
export default class Transactions extends Vue {}
</script>

<style scoped>
td {
  padding: 0;
  margin: 0;
}
.all-transactions {
  width: 96%;
  margin: 1% 2% 0 2%;
  padding: 1em;
}
#all-transactions-container {
  height: 90vh;
  overflow: scroll;
}
.all-transactions-transaction-info {
  justify-content: space-between;
  margin: 0.5em 0;
  padding: 0.5em 1em;
}
table {
  font-size: 1em;
  table-layout: fixed;
  width: 100%;
  border-spacing: 0;
}
td {
  border-bottom: 1px solid #d9dbdb;
  padding: 0.5em;
}
tr p {
  padding: 0.5em;
  border-bottom: 1px solid #727376;
  text-align: start;
  font-size: 0.9em;
  font-weight: 800;
  margin-top: 1em;
}
tr p:first-child {
  margin-top: 0.5em;
}
td:first-child {
  width: 80%;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0.1em 1em;
  text-align: start;
}
td:last-child {
  text-align: end;
  padding-right: 1em;
}
.transactions-table tr:hover {
  cursor: pointer;
  font-weight: 800;
  background-color: #f0f0f0;
}
.transactions-table tr:hover td:first-child {
  border-left: 1px solid #d9dbdb;
}
.transactions-table tr:hover td:last-child {
  border-right: 1px solid #d9dbdb;
}
td img {
  margin-right: 1em;
}
td div {
  display: flex;
  align-items: center;
}

/*responsive*/
@media (max-width: 991px) {
  #all-transactions-container {
    margin-bottom: 7vh;
    height: 80vh;
  }
  table {
    border-spacing: 0;
  }
  td:first-child {
    width: 70%;
    padding: 0.4em;
  }
  td:last-child {
    padding-right: 0em;
  }
}
</style>
