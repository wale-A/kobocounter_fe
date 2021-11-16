<template>
  <main v-show="accounts && accounts?.length" class="dashboard">
    <SideBar />
    <section class="dashboard-content-container">
      <Header />
      <div class="dashboard-content">
        <div class="account-activity">
          <div>
            <p class="bold-text">Account activity</p>
            <hr />
            <IncomeChart
              :height="'36vh'"
              :width="'98%'"
              :fileName="'income_summary__' + from + '_to_' + to"
              :netIncome="netIncome"
            />
          </div>
        </div>
        <div class="f">
          <div>
            <div
              class="dashboard-section-container"
              style="
                display: flex;
                align-content: space-between;
                flex-direction: row;
                justify-content: space-between;
              "
            >
              <p class="bold-text">Recent categories</p>
              <div>
                <span
                  class="material-icons input-left-icon"
                  @click="() => (displayChart = 'wordcloud')"
                  :enabled="displayChart === 'wordcloud'"
                  style="font-size: 1.5em"
                >
                  chevron_left
                </span>
                <span>&nbsp;</span>
                <span
                  class="material-icons input-left-icon"
                  @click="() => (displayChart = 'piechart')"
                  :enabled="displayChart === 'piechart'"
                  style="font-size: 1.5em"
                >
                  chevron_right
                </span>
              </div>
            </div>
            <hr />
            <WordCloudChart
              :height="'50vh'"
              :inputData="establishmentActivities"
              :width="'90%'"
              :fileName="'spending pattern'"
              v-show="displayChart === 'wordcloud'"
            />

            <DonutChart
              :height="'50vh'"
              :inputData="transactionCategories"
              :width="'95%'"
              :fileName="'spending_category_summary__' + from + '_to_' + to"
              v-show="displayChart === 'piechart'"
            />
          </div>
        </div>
        <div class="account-summary">
          <p class="bold-text">Account summary</p>
          <hr />
          <div class="balance">
            <p>Your current balance</p>
            <p class="account-balance bold-text">N{{ accountBalance || 0 }}</p>
          </div>
          <div class="balance-detail">
            <div class="balance-detail-section">
              <img src="/img/assets/income.png" />
              <div>
                <p>Income</p>
                <p class="bold-text amount">N{{ totalRevenue }}</p>
              </div>
            </div>
            <div class="balance-detail-section">
              <img src="/img/assets/expense.png" />
              <div>
                <p>Expenses</p>
                <p class="bold-text amount">N{{ totalExpenses }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="budget-performance">
          <p class="bold-text">Budget Performance</p>
          <hr />
          <div class="balance">
            <p>Your current balance</p>
            <p class="account-balance bold-text">N{{ accountBalance || 0 }}</p>
          </div>
          <div class="balance-detail">
            <div class="balance-detail-section">
              <img src="/img/assets/income.png" />
              <div>
                <p>Income</p>
                <p class="bold-text">N{{ totalRevenue }}</p>
              </div>
            </div>
            <div class="balance-detail-section">
              <img src="/img/assets/expense.png" />
              <div>
                <p>Expenses</p>
                <p class="bold-text">N{{ totalExpenses }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="top-expenses">
          <p class="bold-text">Top 3 Expenses</p>
          <hr />
          <div class="top-expenses-detail">
            <table>
              <tr>
                <th></th>
                <th>Category</th>
                <th>% of Expenses</th>
              </tr>
              <tr>
                <td><span class="bold-text"> Groceries </span></td>
                <td>N18,000</td>
                <td>30%</td>
              </tr>
              <tr>
                <td><span class="bold-text"> Shopping </span></td>
                <td>N12,000</td>
                <td>25%</td>
              </tr>
              <tr>
                <td><span class="bold-text"> Transport </span></td>
                <td>N8,000</td>
                <td>10%</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </section>
  </main>

  <AddNewAccount :hasAccounts="!(accounts && accounts?.length == 0)" />

  <img
    style="width: 30%; margin: 5% 35%"
    v-show="!accounts"
    src="/img/assets/loading.gif"
    alt="loading image"
  />
</template>

<style scoped></style>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { mapGetters } from "vuex";
import { deleteSubscription } from "@/_helpers/pushNotification";
import {
  NetIncome,
  TransactionCategories,
  Account,
  TransactionInfo,
  EstablishmentActivity,
} from "@/types";
import Multiselect from "@vueform/multiselect";
import { add, sub, subMonths } from "date-fns";
import AddNewAccount from "@/components/AddNewAccount.vue";
import SingleTransaction from "@/components/SingleTransaction.vue";
import DonutChart from "@/components/charts/DonutChart.vue";
import IncomeChart from "@/components/charts/IncomeChart.vue";
import WordCloudChart from "@/components/charts/WordCloudChart.vue";
import { subscribeUser } from "@/_helpers/pushNotification";
import { notify } from "@kyvg/vue3-notification";
import Header from "@/components/Header.vue";
import SideBar from "@/components/SideBar.vue";

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
      netIncomeData: [],
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
      displayChart: "piechart",
    };
  },
  computed: {
    ...mapGetters([
      "accounts",
      "transactions",
      "netIncome",
      "transactionCategories",
      "accountCreateStatus",
      "recurrentExpenses",
      "establishmentActivities",
      "revenue",
      "expense",
    ]),
    totalRevenue: function () {
      const rev =
        this.revenue?.reduce(
          (acc: number, val: { amount: number }) => (acc += val.amount),
          0
        ) || 0;

      return rev.toLocaleString();
    },
    totalExpenses: function () {
      const exp = Math.abs(
        this.expense?.reduce(
          (acc: number, val: { amount: number }) => (acc += val.amount),
          0
        ) || 0
      );
      return exp.toLocaleString();
    },
  },
  components: {
    Multiselect,
    AddNewAccount,
    SingleTransaction,
    DonutChart,
    IncomeChart,
    WordCloudChart,
    Header,
    SideBar,
  },
  methods: {
    scrollPage() {
      window.addEventListener("scroll", function () {
        const header = document.querySelector("header");
        if (header) header.classList.toggle("sticky", window.scrollY > 0);
      });
    },
    toggleMenu() {
      var menuToggle = document.querySelector(".toggle");
      var menu = document.querySelector(".menu");
      if (menuToggle && menu) {
        menuToggle.classList.toggle("active");
        menu.classList.toggle("active");
      }
    },
    logoutUser() {
      deleteSubscription();
      this.$store.commit("logoutUser");
    },
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
      // const multipleTransactionCloseModal = document.getElementById(
      //   "multiple-transaction-close-modal"
      // )!;
      // const multipleTransactionModal = document.getElementById(
      //   "multiple-transaction-modal"
      // )!;
      // multipleTransactionCloseModal.onclick = function () {
      //   multipleTransactionModal.style.display = "none";
      // };
      // window.onclick = function (event: MouseEvent) {
      //   if (event.target == multipleTransactionModal) {
      //     multipleTransactionModal.style.display = "none";
      //   }
      // };
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
      // document.getElementById("multiple-transaction-modal")!.style.display =
      //   "block";
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
      // let result: Record<string, string> = {};
      let sum = 0;
      for (var i = 0; i < (this.netIncome as NetIncome[]).length; i++) {
        // hold the value of netIncome for that day
        sum += this.netIncome[i].amount;
        // add it to the last netIncome value we have, if it is not the first item in the index
        // result[this.netIncome[i].date] = (sum / 1000).toFixed(2);
        this.netIncomeData.push({
          date: this.netIncome[i].date,
          amount: sum,
        });
      }
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
    netIncome() {
      // this.parseNetIncome();
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
