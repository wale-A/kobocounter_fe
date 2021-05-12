<template>
  <Header :display-menu="true" />
  <main v-show="accounts && accounts.length > 0">
    <section>
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
        @close="updateAccountBalance"
      />
      <div
        id="account-info-container"
        style="
          display: flex;
          justify-content: space-between;
          padding: 1% 5%;
          align-items: center;
        "
      >
        <div id="account-info" style="width: 70%">
          <p class="mid-text darker-color" style="margin: 0">
            {{ accountBalance }}
          </p>
          <p class="small-text darker-color" style="margin: 0">All expenses</p>
        </div>
        <div id="time-filter" style="width: 30%; padding-left: 2%">
          <!-- <Multiselect
            v-model="selectedPeriod"
            placeholder="Period"
            :options="[7, 30, 60, 90]"
          />
          <p class="small-text darker-color" style="margin: 0; margin-left: 4%">
            Days
          </p> -->
        </div>
      </div>
    </section>
    <section>
      <p class="mid-text darker-color">Net Income</p>
      <line-chart
        :data="netIncomeData"
        thousands=","
        loading="Loading..."
        empty="We don't have your transactions yet"
        class="chart"
        :download="{
          background: '#fff',
          filename: 'net-income',
        }"
        :legend="false"
        label="Net Income"
      ></line-chart>
    </section>
    <section>
      <p class="mid-text darker-color">Transaction Category</p>
      <pie-chart
        :donut="true"
        :data="transactionCategoryData"
        class="chart"
        loading="Loading..."
        empty="We don't have your transactions yet"
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
        empty="We don't have your transactions yet"
        :download="{
          background: '#fff',
          filename: 'account-expenses-amount',
        }"
        xtitle="Amount N,000"
      ></bar-chart>
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
div.multiselect-input {
  border: 0 !important;
}
div.multiselect {
  border: 0 !important;
  font-family: "Poppins" !important;
}

@media screen and (max-width: 600px) {
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
}
</style>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Header from "@/components/Header.vue";
import { mapGetters } from "vuex";
import { NetIncome, TransactionCategories, Account } from "@/types";
import toastr from "toastr";
// import "vue-select/dist/vue-select.css";
import Multiselect from "@vueform/multiselect";

@Options({
  created() {
    this.setup();
  },
  data() {
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
    };
  },
  computed: {
    ...mapGetters([
      "accounts",
      "transactions",
      "income",
      "transactionCategories",
      "accountCreateStatus",
    ]),
  },
  components: {
    Header,
    Multiselect,
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

      if (this.accountSelectionUpdated) {
        this.setup(
          this.selectedAccounts && this.selectedAccounts.length > 0
            ? this.selectedAccounts.join(", ")
            : undefined
        );
        this.accountSelectionUpdated = false;
      }
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
    setup(accountIds: string) {
      this.$store.dispatch("getAccounts");
      this.$store.dispatch("getTransactions", { accountId: accountIds });
      this.$store.dispatch("getNetIncome", { accountId: accountIds });
      this.$store.dispatch("getTransactionCategories", {
        accountId: accountIds,
      });
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
  },
  watch: {
    income(newVal?: NetIncome[]) {
      if (newVal && newVal.length > 0) this.parseNetIncome();
    },
    transactionCategories(newVal?: TransactionCategories[]) {
      if (newVal && newVal.length > 0) this.parseTransactionCategories();
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
    selectedAccounts(newAccounts?: string, oldAccounts?: string) {
      if (newAccounts !== oldAccounts && newAccounts) {
        this.accountSelectionUpdated = true;
      }
    },
  },
})
export default class Dashboard extends Vue {}
</script>
