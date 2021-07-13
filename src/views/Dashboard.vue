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
          <div id="account-info">
            <div>
              <p class="mid-text darker-color" style="margin: 0">
                <span style="color: black">&#8358;</span>
                {{ accountBalance }}
              </p>
              <p class="small-text darker-color" style="margin: 0">
                Account Balance
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

    <!-- net-income -->
    <!-- <section>
      <p class="mid-text darker-color">
        Net Income
        <span class="small-text" style="color: black"> (&#8358; '000)</span>
      </p>
      <line-chart
        :data="netIncomeData"
        :pointRadius="0"
        thousands=","
        loading="Loading..."
        empty="We don't have data for the selected period..."
        class="chart margin-left"
        :library="{
          showLines: false,
          onClick: netIncomeEventHandler,
        }"
        :download="{
          background: '#fff',
          filename: 'net-income',
        }"
        :legend="false"
        label="Net Income (in thousands)"
      ></line-chart>
    </section> -->

    <IncomeChart
      :height="'500px'"
      :width="'100%'"
      :fileName="'income_summary__' + from + '_to_' + to"
      :revenue="revenue"
      :expense="expense"
      v-if="revenue || expense"
    />

    <!-- transaction categories -->
    <!-- <section>
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
        :library="{
          onClick: transactionCategoriesEventHandler,
        }"
      ></pie-chart>
    </section> -->

    <DonutChart
      :inputData="transactionCategories"
      :onClick="transactionCategoriesEventHandler"
      :height="'500px'"
      :width="'100%'"
      :fileName="'spending_category_summary__' + from + '_to_' + to"
    />

    <!-- recurrent expenditure -->
    <section>
      <p class="mid-text darker-color">
        Recurring expenses
        <span class="small-text"> (last 3 months) </span>
      </p>
      <div v-if="recurrentExpenses.length == 0" class="small-text accent-color">
        <span>
          You don't have recurring transactions in the last 3 months
        </span>
        <span v-if="selectedAccounts"> for selected account(s)</span>
      </div>

      <div
        v-for="(exp, index) in recurrentExpenses"
        :key="index"
        style="
          display: flex;
          justify-content: space-between;
          padding: 5px 5px;
          border: 1px solid #1c5298;
          border-radius: 10px;
          margin-bottom: 5px;
        "
        :data-index="index"
        class="expense"
        @click.prevent="recurrentExpenseClickHandler"
      >
        <div style="text-align: start; width: 85%">
          <p class="small-text" style="line-height: 20px; margin-top: 0">
            {{ exp.narration }}
          </p>
          <span class="small-text darker-color">
            {{ exp.transactionCategory }}
          </span>
        </div>
        <div style="text-align: end; max-width: 15%">
          <p
            class="small-text"
            style="
              font-weight: 700;
              margin-top: 0;
              color: white;
              background-color: gray;
              text-align: center;
              padding: 5px 13px;
              border-radius: 18px;
            "
          >
            {{ exp.frequency }}
          </p>
        </div>
      </div>
    </section>

    <!-- word cloud -->
    <!-- <section
      v-show="establishmentActivities && establishmentActivities.length > 0"
    >
      <p class="mid-text darker-color">Spending Pattern</p>
      <canvas id="word-cloud"> </canvas>
    </section> -->

    <WordCloudChart
      v-if="establishmentActivities"
      :inputData="establishmentActivities"
      :height="'450px'"
      :width="'100%'"
      :fileName="'spending pattern'"
    />
  </main>

  <AddNewAccount :hasAccounts="!(accounts && accounts?.length == 0)" />

  <img
    style="width: 30%; margin: 5% 35%"
    v-show="!accounts"
    src="@/assets/loading.gif"
    alt="loading image"
  />

  <!-- Multiple Transactions Modal -->
  <div id="multiple-transaction-modal" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <div>
          <p class="mid-text darker-color" style="margin: 0">
            {{ multipleTransactionModalTitle }}
          </p>
          <p
            v-show="
              multipleTransactionModalSubtitle &&
              multipleTransactionModalSubtitle.length > 0
            "
            class="small-text lighter-color"
            style="margin: 0"
          >
            {{ multipleTransactionModalSubtitle }}
          </p>
        </div>
        <span
          id="multiple-transaction-close-modal"
          class="close-modal material-icons"
        >
          close
        </span>
      </div>
      <div
        v-show="modalTransactions && modalTransactions.transactions.length > 0"
        v-for="(txn, index) in modalTransactions.transactions"
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
          <p
            class="small-text"
            style="line-height: 20px; margin: 0; overflow: hidden"
          >
            {{ txn.narration }}
          </p>
          <span class="small-text darker-color">
            {{
              txn?.establishment?.name || txn?.recipient || txn.displayCategory
            }}
          </span>
        </div>
        <div
          style="
            text-align: end;
            width: 33%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: flex-end;
          "
        >
          <p
            class="small-text darker-color"
            :style="{
              'font-weight': 500,
              color:
                txn.amount < 0 ? 'rgba(255, 10, 10, 0.7)' : 'rgb(20, 180, 20)',
              'line-height': '20px',
              height: '20px',
              margin: 0,
            }"
          >
            {{ Math.abs(txn.amount).toLocaleString() }}
          </p>
          <span class="small-text darker-color" style="display: block">
            {{ new Date(txn.date).toLocaleDateString("en-GB") }}
          </span>
          <span
            v-show="transactions.some((x) => x.id === txn.id)"
            class="material-icons expand-transaction"
            :data_txnId="txn.id"
            style="
              padding: 5px;
              background-color: #aaa;
              color: white;
              border-radius: 5px;
              cursor: pointer;
              font-size: 10px;
            "
            @click="() => singleTransactionEventHandler(txn.id)"
          >
            open_in_full
          </span>
        </div>
      </div>
      <div style="display: flex; justify-content: space-between">
        <p class="mid-text">Total</p>
        <p class="mid-text">
          <span style="font-weight: 800; font-size: large">&#8358; </span>
          <span
            :style="{
              color:
                modalTransactions.total < 0
                  ? 'rgba(255, 10, 10, 0.7)'
                  : 'rgb(20, 180, 20)',
            }"
          >
            {{ Math.abs(modalTransactions.total).toLocaleString() }}
          </span>
        </p>
      </div>
    </div>
  </div>

  <SingleTransaction
    :singleTransaction="singleTransaction"
    :closeFunction="() => (singleTransaction = undefined)"
  />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Header from "@/components/Header.vue";
import { mapGetters } from "vuex";
import {
  NetIncome,
  TransactionCategories,
  Account,
  TransactionInfo,
  EstablishmentActivity,
} from "@/types";
import Multiselect from "@vueform/multiselect";
import { add, sub, subMonths } from "date-fns";
import WordCloud from "wordcloud";
import AddNewAccount from "@/components/AddNewAccount.vue";
import SingleTransaction from "@/components/SingleTransaction.vue";
import DonutChart from "@/components/charts/DonutChart.vue";
import IncomeChart from "@/components/charts/IncomeChart.vue";
import WordCloudChart from "@/components/charts/WordCloudChart.vue";
import { subscribeUser } from "@/_helpers/pushNotification";
import { notify } from "@kyvg/vue3-notification";

@Options({
  created() {
    this.setup();
  },
  mounted() {
    this.modalMethods();
    subscribeUser();
  },
  data() {
    const from = subMonths(Date.now(), 1);
    const to = new Date();
    return {
      accountBalance: 0,
      accountBalanceData: {},
      netIncomeData: {},
      transactionCategoryData: {},
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
      modalTransactions: { transactions: [], total: 0 },
      multipleTransactionModalTitle: "",
      multipleTransactionModalSubtitle: "",
      singleTransaction: undefined,
    };
  },
  computed: {
    ...mapGetters([
      "accounts",
      "transactions",
      "income",
      "transactionCategories",
      "accountCreateStatus",
      "recurrentExpenses",
      "establishmentActivities",
      "revenue",
      "expense",
    ]),
  },
  components: {
    Header,
    Multiselect,
    AddNewAccount,
    SingleTransaction,
    DonutChart,
    IncomeChart,
    WordCloudChart,
  },
  methods: {
    getTimeForTimeZone(date: number) {
      return add(new Date(date), {
        minutes: new Date().getTimezoneOffset() + 60,
      });
    },
    recurrentExpenseClickHandler(e: Event) {
      const index = (e.currentTarget as any).dataset.index;
      this.multipleTransactionModalTitle = `Recurrent Expenses`;
      this.modalTransactions.transactions = this.recurrentExpenses[
        index
      ].transactions;
      this.modalTransactions.total = this.modalTransactions.transactions.reduce(
        (x: number, y: TransactionInfo) => x + y.amount,
        0
      );
      this.showMultipleTransactionsModal();
    },
    modalMethods() {
      const multipleTransactionCloseModal = document.getElementById(
        "multiple-transaction-close-modal"
      )!;
      const multipleTransactionModal = document.getElementById(
        "multiple-transaction-modal"
      )!;

      multipleTransactionCloseModal.onclick = function () {
        multipleTransactionModal.style.display = "none";
      };
      window.onclick = function (event: MouseEvent) {
        if (event.target == multipleTransactionModal) {
          multipleTransactionModal.style.display = "none";
        }
      };
    },
    netIncomeEventHandler(
      _: number,
      arg: Array<{ datasetIndex: number; index: number }>
    ) {
      if (!(arg && arg.length > 0)) return;

      this.multipleTransactionModalTitle = `Net-Income Transactions`;
      const { index } = arg[0];
      const keys = Object.keys(this.netIncomeData);
      const selectedDate = keys[index].replace(/-/g, "/");
      this.multipleTransactionModalSubtitle = new Date(
        selectedDate
      ).toLocaleDateString("en-GB");
      const selectedDateStart = sub(
        new Date(selectedDate).setHours(0, 0, 0, 0),
        {
          minutes: new Date().getTimezoneOffset(),
        }
      ).getTime();
      const selectedDateEnd = sub(new Date(selectedDate).setHours(23, 59, 59), {
        minutes: new Date().getTimezoneOffset(),
      }).getTime();

      this.modalTransactions.transactions = this.transactions.filter(
        (x: TransactionInfo) =>
          x.date >= selectedDateStart && x.date <= selectedDateEnd
      );
      this.modalTransactions.total = this.modalTransactions.transactions.reduce(
        (x: number, y: TransactionInfo) => x + y.amount,
        0
      );
      this.showMultipleTransactionsModal();
    },
    transactionCategoriesEventHandler(
      _: number,
      arg: Array<{ datasetIndex: number; index: number }>
    ) {
      if (!(arg && arg.length > 0)) return;

      this.multipleTransactionModalTitle = `Category Transactions`;
      const { index } = arg[0];

      const keys = Object.keys(this.transactionCategoryData);
      this.multipleTransactionModalSubtitle = keys[index];
      const selectedCategory = keys[index].substr(0, 3).toLowerCase();

      this.modalTransactions.transactions = this.transactions.filter(
        (x: TransactionInfo) =>
          x.displayCategory.toLowerCase().startsWith(selectedCategory)
      );
      this.modalTransactions.total = this.modalTransactions.transactions.reduce(
        (x: number, y: TransactionInfo) => x + y.amount,
        0
      );
      this.showMultipleTransactionsModal();
    },
    spendingPatternEventHandler(activity: [string, number]) {
      this.multipleTransactionModalTitle = `Spending Pattern`;
      this.multipleTransactionModalSubtitle = activity[0].toUpperCase();
      const transactionIds = (this
        .establishmentActivities as EstablishmentActivity[]).find(
        (x) => x.activity == activity[0]
      )?.transactionIds;
      this.modalTransactions.transactions = this.transactions.filter(
        (x: TransactionInfo) => transactionIds?.includes(x.id)
      );
      this.modalTransactions.total = this.modalTransactions.transactions.reduce(
        (x: number, y: TransactionInfo) => x + y.amount,
        0
      );
      this.showMultipleTransactionsModal();
    },
    singleTransactionEventHandler(transactionId: string) {
      this.singleTransaction = {
        ...(this.transactions.find(
          (x: TransactionInfo) => x.id == transactionId
        ) as TransactionInfo),
      };
    },
    showMultipleTransactionsModal() {
      document.getElementById("multiple-transaction-modal")!.style.display =
        "block";
    },
    multipleLabel(params: { label: string }[]) {
      return params.map((x) => x.label.split(/\W/)[0]).join(", ");
    },
    updateAccountBalance() {
      let balance = "";
      if (this.selectedAccounts && this.selectedAccounts?.length > 0) {
        balance = (this.accounts as Account[])
          .filter((x) => this.selectedAccounts.includes(x.id))
          .reduce((sum, acct) => {
            return sum + (acct.balance || 0);
          }, 0)
          .toFixed(2);
      } else {
        balance = (this.accounts as Account[])
          .reduce((sum, acct) => {
            return sum + (acct.balance || 0);
          }, 0)
          .toFixed(2);
      }
      this.accountBalance = parseFloat(balance).toLocaleString();
    },
    setup() {
      const accountId = this.selectedAccounts.join(", ");
      const start = this.from ? new Date(this.from).getTime() : undefined;
      const end = this.to ? new Date(this.to).getTime() : undefined;
      this.$store.dispatch("getAccounts");
      this.$store.dispatch("getTransactions", {
        accountId,
        start,
        end,
      });
      this.$store.dispatch("getNetIncome", {
        accountId,
        start,
        end,
      });
      this.$store.dispatch("getExpense", {
        accountId,
        start,
        end,
      });
      this.$store.dispatch("getRevenue", {
        accountId,
        start,
        end,
      });
      this.$store.dispatch("getTransactionCategories", {
        accountId,
        start,
        end,
      });
      this.$store.dispatch("getRecurringExpenses", {
        accountId,
      });
      this.$store.dispatch("getEstablishmentActivities", {
        accountId,
        start,
        end,
      });
      this.disableSearchButtons();
    },
    parseNetIncome() {
      let result: Record<string, string> = {};
      for (var i = 0; i < (this.income as NetIncome[]).length; i++) {
        result[this.income[i].date] = (
          (this.income[i].amount as number) / 1000
        ).toFixed(2);
      }
      this.netIncomeData = result;
    },
    parseTransactionCategories() {
      this.transactionCategoryData = {};
      const categories = (this
        .transactionCategories as TransactionCategories[]).filter(
        (x) => x.category != null
      );
      for (var i = 0; i < categories.length; i++) {
        this.transactionCategoryData[
          categories[i].displayCategory
        ] = parseFloat(categories[i].amount.toFixed(2));
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
    subscribeToPushNotifications() {
      subscribeUser();
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
      if (newVal !== undefined && newVal) {
        notify({
          text: "Account added successfully",
          type: "success",
        });
        location.reload();
      } else if (newVal !== undefined && !newVal)
        notify({
          text: "Unable to add account, please retry",
          type: "error",
        });
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
    // establishmentActivities(newVal?: EstablishmentActivity[]) {
    //   if (!newVal) return;
    //   const counts = newVal.map((x) => x.transactionIds.length);
    //   const max = Math.max(...counts);
    //   const min = Math.min(...counts);

    //   function scaleValue(value: number, from: [number, number], to = [2, 10]) {
    //     if (from[0] === from[1]) return to[1];

    //     var scale = (to[1] - to[0]) / (from[1] - from[0]);
    //     var capped = Math.min(from[1], Math.max(from[0], value)) - from[0];
    //     return capped * scale + to[0];
    //   }

    //   const node = document.getElementById("word-cloud") as any;
    //   node.width = node.offsetWidth || window.innerWidth * 0.9;
    //   node.height = node.offsetHeight || window.innerHeight * 0.5;

    //   WordCloud(node, {
    //     list: newVal?.map((x) => {
    //       return [x.activity, scaleValue(x.transactionIds.length, [min, max])];
    //     }),
    //     backgroundColor: "#fff",
    //     fontFamily: "Times, serif",
    //     fontWeight: "normal",
    //     minRotation: 1.57,
    //     clearCanvas: true,
    //     gridSize: 2,
    //     weightFactor: (weight) => Math.log2(weight) * 15,
    //     click: this.spendingPatternEventHandler,
    //     drawOutOfBound: true,
    //   });
    // },
  },
})
export default class Dashboard extends Vue {}
</script>

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
section {
  margin-top: 15px;
  margin-bottom: 35px;
  background-color: white;
}
section p {
  margin-bottom: 0;
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
    width: 57%;
  }
  #time-filter {
    width: 43%;
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
    max-height: 40px;
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
  width: 100%;
  height: 40%;
  border-color: rgba(0, 0, 0, 0.1);
  border-width: 1px;
  border-style: solid;
}
.margin-left {
  margin-left: -15px;
}

@media screen and (max-width: 700px) {
  #multiselect {
    margin-left: 0;
  }
  #word-cloud {
    width: 100%;
    height: 45%;
  }
  .multiselect.is-searchable {
    /* margin-right: 25px !important; */
    width: 85%;
  }
}
</style>
