<template>
  <Header :display-menu="true" />
  <main v-show="accounts && accounts.length > 0">
    <section id="filter-section">
      <div id="filters">
        <div id="select-button">
          <Multiselect
            :searchable="true"
            v-model="selectedAccounts"
            placeholder="All accounts"
            :options="transformedAccountInfo"
            mode="tags"
            :multipleLabel="
              (params) => params.map((x) => x.label.split(/\W/)[0]).join(', ')
            "
            noOptionsText="The list is empty"
            noResultsText="No results found"
          />
          <button
            id="small-search-button"
            style="padding: 5px; padding-bottom: 0px; width: unset"
            @click="refreshDashboardData"
            disabled
          >
            <i class="material-icons">search</i>
          </button>
        </div>
        <div id="account-info-container">
          <div id="account-info" style="width: 70%">
            <div style="display: none">
              <p class="mid-text darker-color" style="margin: 0">
                {{ accountBalance }}
              </p>
              <p class="small-text darker-color" style="margin: 0">
                All expenses
              </p>
            </div>
          </div>
          <div id="time-filter">
            <input type="date" v-model="from" :max="to" />
            <input type="date" v-model="to" :min="from" />
          </div>
        </div>
      </div>
      <div id="filter-button">
        <button
          id="big-search-button"
          style="padding: 5px; padding-bottom: 0px"
          @click="refreshDashboardData"
          disabled
        >
          <i class="material-icons">search</i>
        </button>
      </div>
    </section>
    <section>
      <p class="mid-text darker-color">Net Income</p>
      <line-chart
        :data="netIncomeData"
        :pointRadius="0"
        thousands=","
        loading="Loading..."
        empty="We don't have data for the selected period..."
        class="chart"
        :library="{ showLines: false }"
        :download="{
          background: '#fff',
          filename: 'net-income',
        }"
        :legend="false"
        label="Net Income"
        prefix="N"
      ></line-chart>
    </section>
    <section>
      <p class="mid-text darker-color">Transaction Category</p>
      <pie-chart
        :donut="true"
        :data="transactionCategoryData"
        class="chart"
        loading="Loading..."
        empty="We don't have data for the selected period..."
        :download="{
          background: '#fff',
          filename: 'account-expenses',
        }"
        legend="bottom"
      ></pie-chart>
    </section>
    <section style="margin-top: -15px">
      <bar-chart
        :data="transactionCategoryAndAmountData"
        thousands=","
        class="chart"
        loading="Loading..."
        empty="We don't have for the selected period..."
        :download="{
          background: '#fff',
          filename: 'account-expenses-amount',
        }"
        xtitle="Amount N,000"
      ></bar-chart>
    </section>
    <section>
      <p class="mid-text darker-color">
        Recurring expenses
        <span class="small-text"> (last 3 months) </span>
      </p>
      <div v-if="subscriptions.length == 0" class="small-text accent-color">
        <span>
          You don't have recurring transactions in the last 3 months
        </span>
        <span v-if="selectedAccounts"> for selected account(s)</span>
      </div>

      <div
        v-for="(exp, index) in subscriptions"
        :key="index"
        style="
          display: flex;
          justify-content: space-between;
          padding: 5px 5px;
          border: 1px solid #1c5298;
          border-radius: 10px;
          margin-bottom: 5px;
        "
      >
        <div style="text-align: start; width: 67%">
          <p class="small-text" style="line-height: 20px; margin-top: 0">
            {{ exp.narration }}
          </p>
          <span class="small-text darker-color">
            {{ exp.transactionCategory }}
          </span>
        </div>
        <div style="text-align: end; width: 33%">
          <p
            class="small-text darker-color"
            style="
              font-weight: 500;
              color: rgba(255, 10, 10, 0.7);
              line-height: 20px;
              margin-top: 0;
            "
          >
            {{
              new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "NGN",
              }).format(exp.amount)
            }}
          </p>
          <span class="small-text darker-color">
            {{ new Date(exp.date).toLocaleDateString("en-GB") }}
          </span>
        </div>
      </div>
    </section>

    <section
      v-show="establishmentActivities && establishmentActivities.length > 0"
    >
      <p class="mid-text darker-color">Word Cloud</p>
      <canvas id="word-cloud" height="500" width="700"> </canvas>
    </section>
    <button class="floating-button" @click="addAccount" title="Add an account">
      +
    </button>
  </main>
  <aside v-show="accounts && accounts.length === 0">
    <img src="@/assets/logo.svg" alt="logo" />
    <p class="accent-color mid-text">You have not added any account</p>
    <p class="lighter-color small-text">
      Add an account to start tracking your leaks
    </p>
    <button type="button" @click="addAccount">ADD AN ACCOUNT</button>
  </aside>
  <img
    style="width: 100%; margin-top: 15%"
    v-show="!accounts"
    src="@/assets/loading.gif"
    alt="loading image"
  />
</template>

<style src="@vueform/multiselect/themes/default.css"></style>
<style scoped>
body {
  background-color: #ededf0;
}
main {
  width: 80%;
  margin-right: 10%;
  margin-left: 10%;
  margin-top: 3%;
}
aside {
  position: absolute;
  margin: 10% 20%;
  width: 60%;
  height: 45%;
  background-color: rgba(240, 248, 255, 0.6);
  display: flex;
  flex-flow: column;
  align-items: center;
}
aside img {
  height: 135px;
  margin-top: 5%;
  margin-bottom: 30px;
}
aside p {
  margin: 0;
}
aside button {
  margin-top: 50px;
}
section {
  margin-top: 15px;
  margin-bottom: 35px;
  background-color: white;
}
section p {
  margin-bottom: 0;
}
.floating-button {
  padding: 2px 15px;
  width: unset !important;
  font-size: 2em;
  border-radius: 50%;
  position: fixed;
  top: 90%;
  left: 90%;
  transition: all 0.2s ease-in 0s;
  z-index: 9999;
  cursor: pointer;
  margin: 0;
}
#filter-section {
  display: flex;
}
#filters {
  width: 95%;
  padding-right: 5%;
}
#filter-button {
  width: 5%;
}
#small-search-button {
  display: none;
}
#account-info-container {
  display: flex;
  justify-content: space-between;
  padding: 1% 5%;
  align-items: center;
}
#account-info {
  width: 70%;
}
#time-filter {
  width: 30%;
  padding-left: 2%;
  padding-top: 5px;
}
input[type="date"] {
  height: 30px !important;
  font-size: 15px;
  font-family: "Poppins";
  margin-top: 0;
}

@media screen and (max-width: 700px) {
  main {
    width: 90%;
    margin-right: 5%;
    margin-left: 5%;
    margin-top: 3%;
  }
  aside {
    margin: 10% 5%;
    width: 90%;
  }
  .floating-button {
    top: 90%;
    left: 83%;
  }
  section > .chart {
    height: 230px !important;
  }
  #filters {
    width: 100%;
    padding: 0;
  }
  #account-info-container {
    padding-left: 0;
    padding-right: 0;
  }
  #account-info {
    width: 60%;
  }
  #time-filter {
    width: 40%;
    padding-left: 0;
  }
  input[type="date"] {
    height: 27px !important;
    font-size: 13px;
    font-family: "Poppins";
    margin-top: 0;
    padding-left: 0;
  }
  #filter-button {
    display: none;
  }
  #small-search-button {
    display: unset;
  }
  #select-button {
    display: flex;
  }
  button {
    margin-top: 0;
  }
}
</style>
<style>
div.multiselect-input {
  border: 0;
  border-bottom: 1px solid grey;
}
div.multiselect {
  font-family: "Poppins";
}
#word-cloud {
  width: 70%;
  height: 50%;
  image-rendering: auto;
}

@media screen and (max-width: 700px) {
  #multiselect {
    margin-left: 0;
  }
  #word-cloud {
    width: 100%;
    height: 50%;
  }
}
</style>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Header from "@/components/Header.vue";
import { mapGetters } from "vuex";
import { NetIncome, TransactionCategories, Account } from "@/types";
import toastr from "toastr";
import Multiselect from "@vueform/multiselect";
import { subMonths } from "date-fns";
import WordCloud from "wordcloud";

@Options({
  created() {
    this.setup();
    this.$store.dispatch("getEstablishmentActivities");
  },
  mounted() {
    this.$store.dispatch("subscribeUser");
  },
  data() {
    const from = subMonths(Date.now(), 1);
    const to = new Date();
    return {
      accountBalance: 0,
      accountBalanceData: {},
      netIncomeData: {},
      transactionCategoryData: {},
      transactionCategoryAndAmountData: {},
      selectedAccounts: [],
      transformedAccountInfo: [],
      selectedPeriod: 30,
      accountSelectionUpdated: false,
      from: `${from.getFullYear()}-${(from.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${from.getDate().toString().padStart(2, "0")}`,
      to: `${to.getFullYear()}-${(to.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${to.getDate().toString().padStart(2, "0")}`,
    };
  },
  computed: {
    ...mapGetters([
      "accounts",
      "transactions",
      "income",
      "transactionCategories",
      "accountCreateStatus",
      "subscriptions",
      "establishmentActivities",
    ]),
  },
  components: {
    Header,
    Multiselect,
    // [VueWordCloud.name]: VueWordCloud,
  },
  methods: {
    multipleLabel(params: { label: string }[]) {
      return params.map((x) => x.label.split(/\W/)[0]).join(", ");
    },
    updateAccountBalance() {
      let balance = "";
      if (this.selectedAccounts && this.selectedAccounts?.length > 0) {
        balance = (this.accounts as Account[])
          .filter((x) => this.selectedAccounts.includes(x.id))
          .reduce((sum, acct) => {
            return sum + acct.balance;
          }, 0)
          .toFixed(2);
      } else {
        balance = (this.accounts as Account[])
          .reduce((sum, acct) => {
            return sum + acct.balance;
          }, 0)
          .toFixed(2);
      }
      this.accountBalance = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "NGN",
      }).format(parseFloat(balance));
    },
    addAccount() {
      const fn = (code: string) => this.$store.dispatch("addAccount", { code });
      const options = {
        onSuccess: function (response: { code: string }) {
          fn(response.code);
        },
      };
      this.$launchMono(options);
    },
    setup() {
      const accountIds = this.selectedAccounts.join(", ");
      this.$store.dispatch("getAccounts");
      this.$store.dispatch("getTransactions", {
        accountId: accountIds,
        start: this.from ? new Date(this.from).getTime() : undefined,
        end: this.to ? new Date(this.to).getTime() : undefined,
      });
      this.$store.dispatch("getNetIncome", {
        accountId: accountIds,
        start: this.from ? new Date(this.from).getTime() : undefined,
        end: this.to ? new Date(this.to).getTime() : undefined,
      });
      this.$store.dispatch("getTransactionCategories", {
        accountId: accountIds,
        start: this.from ? new Date(this.from).getTime() : undefined,
        end: this.to ? new Date(this.to).getTime() : undefined,
      });
      this.$store.dispatch("getRecurringExpenses", {
        accountId: accountIds,
      });
      this.disableSearchButtons();
    },
    parseNetIncome() {
      let result: Record<string, string> = {};
      for (var i = 0; i < (this.income as NetIncome[]).length; i++) {
        result[this.income[i].date] = (this.income[i].amount as number).toFixed(
          2
        );
      }
      this.netIncomeData = result;
    },
    parseTransactionCategories() {
      this.transactionCategoryData = {};
      this.transactionCategoryAndAmountData = {};
      const categories = (this
        .transactionCategories as TransactionCategories[]).filter(
        (x) => x.category != null
      );
      for (var i = 0; i < categories.length; i++) {
        this.transactionCategoryData[categories[i].displayCategory] =
          categories[i].count;
        this.transactionCategoryAndAmountData[
          categories[i].shortText
        ] = parseFloat((categories[i].amount / 1000).toFixed(2));
      }
    },
    updateSelectedAccount(value: string) {
      this.selectedAccount = value;
    },
    refreshDashboardData() {
      this.setup();
    },
    disableSearchButtons() {
      if (!document.getElementById("small-search-button")) return;

      (document.getElementById("small-search-button") as any).disabled = true;
      (document.getElementById("big-search-button") as any).disabled = true;
    },
    enableSearchButtons() {
      if (!document.getElementById("small-search-button")) return;

      (document.getElementById("small-search-button") as any).disabled = false;
      (document.getElementById("big-search-button") as any).disabled = false;
    },
  },
  watch: {
    income() {
      this.parseNetIncome();
    },
    transactionCategories() {
      this.parseTransactionCategories();
    },
    accountCreateStatus(newVal?: NetIncome[]) {
      if (newVal !== undefined && newVal)
        toastr.success("Account added successful");
      else if (newVal !== undefined && !newVal)
        toastr.error("Unable to add account, please retry");
    },
    accounts(newVal?: Account[]) {
      if (newVal && newVal.length > 0) {
        this.transformedAccountInfo = newVal.map((x) => {
          return {
            label: `${x.bankName}-${x.accountNumber}`,
            value: x.id,
          };
        });
        this.updateAccountBalance();
      } else {
        this.transformedAccountInfo = [];
      }
    },
    from(newVal?: string, oldVal?: string) {
      if (newVal !== oldVal) {
        this.enableSearchButtons();
      }
    },
    to(newVal?: string, oldVal?: string) {
      if (newVal !== oldVal) {
        this.enableSearchButtons();
      }
    },
    selectedAccounts(newVal?: string[], oldVal?: string[]) {
      if (newVal !== oldVal) {
        this.updateAccountBalance();
        this.enableSearchButtons();
      }
    },
    establishmentActivities(
      newVal?: Array<{ count: number; activity: string }>
    ) {
      const node = document.getElementById("word-cloud") as any;
      node.width = node.offsetWidth;
      node.height = node.offsetHeight * 0.7;

      if (!newVal) return;

      WordCloud(node, {
        list: newVal?.map((x) => {
          return [x.activity, x.count];
        }),
        backgroundColor: "#fff",
        // weightFactor: 10,
        fontFamily: "Times, serif",
        // minSize:
        // newVal.map((x) => x.count).reduce((x, y) => x + y, 0) /
        //   newVal.length -
        // 2,
        fontWeight: "normal",
        minRotation: 1.57,
        clearCanvas: true,
        // gridSize: 1,
        gridSize: 1,
        // weightFactor: function (size) {
        //   const numbers = newVal.map((x) => x.count);
        //   const max = Math.max(...numbers);
        //   const min = Math.min(...numbers);
        //   if (size < Math.sqrt(max) - 1) return 0;

        //   const _avg = (max - min) / 2 - 1;
        //   return 2;
        //   // if (size < _avg) return (max / _avg) * size;
        //   // // //   return (Math.pow(size, 1.3) * node.clientWidth) / 1024;
        //   // return max / size;
        //   // return (Math.pow(size, 1.3) * node.clientWidth) / 1024;
        // },
        // minSize: 13,
        weightFactor: 7,
        // color: "#19365e",
      });
    },
  },
})
export default class Dashboard extends Vue {}
</script>
