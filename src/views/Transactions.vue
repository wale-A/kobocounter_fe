<template>
  <main class="dashboard">
    <SideBar :section="'transactions'" />
    <section class="dashboard-content-container">
      <Header />
      <div class="dashboard-content">
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
.all-transactions {
  width: 96%;
  margin: 1% 2% 0 2%;
  padding: 1em;
}
#all-transactions-container {
  height: 85vh;
  margin-bottom: 3vh;
  overflow: scroll;
}
.all-transactions-transaction-info {
  justify-content: space-between;
  margin: 0.5em 0;
  padding: 0.5em 1em;
}
table {
  font-size: 1.3em;
  line-height: 2em;
}

/*responsive*/
@media (max-width: 991px) {
  #all-transactions-container {
    margin-bottom: 7vh;
    height: 76vh;
  }
  tr {
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
