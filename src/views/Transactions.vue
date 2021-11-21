<template>
  <main class="dashboard">
    <SideBar :section="'transactions'" />
    <section class="dashboard-content-container">
      <Header />
      <div class="dashboard-content">
        <div class="expense-categories bordered-container">
          <p class="bold-text">Top 3 Expense categories</p>
          <hr />
          <section class="transaction-expense-categories">
            <div
              v-for="category in [
                'Food & Drinks',
                'Transportation',
                'Airtime & Data',
              ]"
              :key="category"
              class="transaction-expense-categories-item bordered-container"
            >
              <div class="transaction-expense-categories-item-info">
                <p class="category bold-text">{{ category }}</p>
                <p class="amount">
                  N{{
                    parseFloat(
                      (Math.random() * 100 * 1000).toFixed(2)
                    ).toLocaleString()
                  }}
                </p>
              </div>

              <div class="percentage-change">
                <span class="percentage-change-amount">{{
                  (Math.random() * 100).toFixed(2)
                }}</span>
                <span style="font-size: 0.8em">%</span>
                <span
                  v-if="Math.random() < 0.5"
                  style="color: #ff3333"
                  class="percentage-change-direction material-icons bold-text"
                >
                  trending_down</span
                >
                <span
                  v-else
                  style="color: #33cd33"
                  class="percentage-change-direction material-icons bold-text"
                >
                  trending_up
                </span>
              </div>
            </div>
          </section>
        </div>
        <div class="all-transactions bordered-container">
          <p class="bold-text">Transactions</p>
          <hr />
          <section id="all-transactions-container">
            <table>
              <tr v-for="i in 30" :key="i" class="bordered-container">
                <td>
                  <span> {{ getRandomCategory() }} </span>
                </td>
                <td class="date">
                  {{ getRandomDate().toDateString() }}
                </td>
                <td>
                  N{{
                    parseFloat(
                      (Math.random() * 100 * 1000).toFixed(2)
                    ).toLocaleString()
                  }}
                </td>
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

@Options({
  components: {
    SideBar,
    Header,
    AddNewAccount,
  },
  computed: {
    ...mapGetters(["accounts"]),
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
.dashboard-content {
  flex-wrap: unset;
}
.expense-categories,
.all-transactions {
  width: 96%;
  margin: 1% 2% 0 2%;
  padding: 1em;
}
.transaction-expense-categories {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1em 0;
}
.transaction-expense-categories-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1em 0.5em;
  flex-flow: row;
}
.percentage-change {
  margin-left: 0.8em;
  font-size: 1.7em;
}
.transaction-expense-categories-item-info .category {
  color: #007cff;
}
.transaction-expense-categories-item-info .amount {
  font-size: 1.2em;
}
.percentage-change-direction {
  font-size: 0.7em;
}
#all-transactions-container {
  height: 65.5vh;
  margin-bottom: 3vh;
  overflow: scroll;
}
.all-transactions-transaction-info {
  justify-content: space-between;
  margin: 0.5em 0;
  padding: 0.5em 1em;
}

/*responsive*/
@media (max-width: 991px) {
  .transaction-expense-categories-item-info .amount {
    font-size: 0.9em;
  }
  .transaction-expense-categories-item-info .category {
    font-size: 0.9em;
  }
  .percentage-change {
    font-size: 1em;
  }
  .transaction-expense-categories-item {
    padding: 0.2em 1em;
    width: 100%;
    margin: 0.2em 0;
  }
  .percentage-change-direction {
    font-size: 1.2em;
  }
  .transaction-expense-categories {
    flex-direction: column;
  }
  .transaction-expense-categories {
    padding: 0.1em 0;
  }
  .expense-categories {
    padding-bottom: 0.2em;
  }
  #all-transactions-container {
    margin-bottom: 7vh;
  }
  tr {
    font-size: 0.8em;
    height: 3em;
  }
  table {
    border-spacing: 0 0.7em;
  }
  td.date {
    font-size: 0.8em;
  }
}
</style>
