<template>
  <Header :display-menu="true" />
  <main v-show="accounts && accounts.length > 0">
    <section>
      <p class="mid-text darker-color">Balance</p>
      <line-chart :data="accountBalanceData"></line-chart>
    </section>

    <section>
      <p class="mid-text darker-color">Account Expenses</p>
      <pie-chart :donut="true" :data="transactionCategoryData"></pie-chart>
    </section>
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

@media screen and (max-width: 600px) {
  aside {
    margin: 10% 5%;
    width: 90%;
  }
}
</style>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Header from "@/components/Header.vue";
import { mapGetters } from "vuex";
import { NetIncome, TransactionCategories } from "@/types";

@Options({
  created() {
    this.$store.dispatch("getAccounts");
    this.$store.dispatch("getTransactions", { accountId: undefined });
    this.$store.dispatch("getNetIncome", { accountId: undefined });
    this.$store.dispatch("getTransactionCategories", { accountId: undefined });
  },
  data() {
    return {
      accountBalanceData: {},
      transactionCategoryData: [],
    };
  },
  computed: {
    ...mapGetters([
      "accounts",
      "transactions",
      "income",
      "transactionCategories",
    ]),
  },
  components: {
    Header,
  },
  methods: {
    addAccount() {
      const options = {
        onSuccess: function (response: { code: string }) {
          console.log(response.code);
        },
      };
      this.$launchMono(options);
    },
    parseAccountBalances() {
      let result: Record<string, string> = {};
      // let sum = 0;
      for (var i = 0; i < (this.income as NetIncome[]).length; i++) {
        // sum += this.income[i].amount;
        result[this.income[i].date] = (this.income[i].amount as number).toFixed(
          2
        );
      }
      this.accountBalanceData = result;
    },
    parseTransactionCategories() {
      let result = [];
      const categories = (this
        .transactionCategories as TransactionCategories[]).filter(
        (x) => x.category != null
      );
      for (var i = 0; i < categories.length; i++) {
        result.push([categories[i].displayCategory, categories[i].count]);
      }
      console.log({ result });
      this.transactionCategoryData = result;
    },
  },
  watch: {
    income(newVal?: NetIncome[]) {
      if (newVal && newVal.length > 0) this.parseAccountBalances();
    },
    transactionCategories(newVal?: TransactionCategories[]) {
      if (newVal && newVal.length > 0) this.parseTransactionCategories();
    },
  },
})
export default class Dashboard extends Vue {}
</script>
