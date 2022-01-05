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
                <table>
                  <tr v-for="txn in groupedTransactions[date]" :key="txn.id">
                    <td>
                      {{ txn.narration.replace(/\s{4,}/g, "").trim() }}
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
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { mapGetters } from "vuex";
import Header from "@/components/Header.vue";
import SideBar from "@/components/SideBar.vue";
import AddNewAccount from "@/components/AddNewAccount.vue";
import { sub } from "date-fns";
import { Transaction } from "@/types";

@Options({
  created() {
    this.$store.dispatch("getTransactions", {
      accountId: undefined,
      start: undefined,
      end: undefined,
    });
  },
  components: {
    SideBar,
    Header,
    AddNewAccount,
  },
  computed: {
    ...mapGetters(["accounts", "transactions"]),
    groupedTransactions: function () {
      const group: Record<string, any[]> = {};
      for (let i = 0; i < this.transactions?.length || 0; i++) {
        const date = new Date(this.transactions[i].date).toDateString();
        const txn = this.transactions[i] as Transaction;
        group[date] = (group[date] || []).concat({
          amount: txn.amount,
          narration: txn.narration,
        });
      }
      console.log({ group });
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
  border-bottom: 1px solid black;
  padding: 0.5em;
}
tr p {
  padding: 0.5em;
  border-bottom: 1px solid black;
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

/*responsive*/
@media (max-width: 991px) {
  #all-transactions-container {
    margin-bottom: 7vh;
    height: 80vh;
  }
  table {
    border-spacing: 0 0.7em;
  }
  td:first-child {
    width: 70%;
    padding: 0.5em 0;
  }
}
</style>
