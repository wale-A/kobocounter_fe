<template>
  <Page>
    <div>
      <section
        v-show="accounts && accounts?.length"
        class="dashboard-content-container"
      >
        <div class="dashboard-content">
          <Card title="Account activity" class="account-activity">
            <IncomeChart
              :height="'39vh'"
              :width="'98%'"
              :fileName="'income_summary__' + from + '_to_' + to"
              :revenue="revenue"
              :expense="expense"
            />
            <!-- :netIncome="netIncome" -->
          </Card>
          <Card title="Recent categories" class="recent-categories">
            <template #action>
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
            </template>
            <WordCloudChart
              :height="'46vh'"
              :inputData="establishmentActivities"
              :width="'98%'"
              :fileName="'spending pattern'"
              v-show="displayChart === 'wordcloud'"
            />
            <DonutChart
              :height="'46vh'"
              :inputData="transactionCategories"
              :width="'98%'"
              :fileName="'spending_category_summary__' + from + '_to_' + to"
              v-show="displayChart === 'piechart'"
            />
          </Card>
          <Card title="Account summary" class="account-summary">
            <div class="balance">
              <p>Your current balance</p>
              <p class="account-balance bold-text">
                N{{ accountBalance || 0 }}
              </p>
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
          </Card>
          <Card title="Budget Performance" class="budget-performance">
            <GuageChart
              :height="'30vh'"
              :width="'100%'"
              :budgetSummary="[
                {
                  category: 'Budget Spent',
                  value: 70,
                },
                { category: 'Budget Left', value: 30 },
              ]"
              :budgetDetails="[
                { category: 'Food', value: 30, amount: 30000 },
                { category: 'Transport', value: 20, amount: 20000 },
                { category: 'Airtime & Data', value: 15, amount: 15000 },
                { category: 'Fuel', value: 5, amount: 5000 },
                {
                  category: 'Budget Left',
                  value: 30,
                  amount: 30000,
                },
              ]"
              v-show="true"
            />

            <section v-show="false">
              <p>
                You haven't created a budget for this month. Create one now to
                see your budget performance.
              </p>
              <form @submit.prevent="addAccount">
                <input type="submit" value="Create Your Budget" />
              </form>
            </section>
          </Card>
          <Card title="Top 3 Expense categories" class="top-expenses">
            <section class="transaction-expense-categories">
              <div
                v-for="category in [
                  'Food & Drinks',
                  'Transportation',
                  'Airtime & Data',
                ]"
                :key="category"
                class="transaction-expense-categories-item"
              >
                <div class="transaction-expense-categories-item-info">
                  <p class="category bold-text">{{ category }}</p>
                  <p class="amount">
                    {{
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
          </Card>
        </div>
      </section>
      <AddNewAccount :hasAccounts="!(accounts && accounts?.length == 0)" />
    </div>

    <Loader v-show="!accounts" />
  </Page>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { mapGetters, mapActions } from "vuex";
import { subMonths } from "date-fns";
import AddNewAccount from "@/components/AddNewAccount.vue";
import DonutChart from "@/components/charts/DonutChart.vue";
import GuageChart from "@/components/charts/GuageChart.vue";
import IncomeChart from "@/components/charts/IncomeChart.vue";
import WordCloudChart from "@/components/charts/WordCloudChart.vue";
import Card from "@/components/layout/Card.vue";
import Page from "@/components/layout/Page.vue";
import Loader from "@/components/layout/Loader.vue";

@Options({
  components: {
    AddNewAccount,
    DonutChart,
    IncomeChart,
    WordCloudChart,
    Card,
    GuageChart,
    Loader,
    Page,
  },
  data() {
    const from = subMonths(Date.now(), 1);
    const to = new Date();
    return {
      accountBalance: 0,
      selectedAccounts: [],
      from: `${from.getFullYear()}-${(from.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${from.getDate().toString().padStart(2, "0")}`,
      to: `${to.getFullYear()}-${(to.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${to.getDate().toString().padStart(2, "0")}`,
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
  methods: {
    ...mapActions([
      "getAccounts",
      "getTransactions",
      "getNetIncome",
      "getExpense",
      "getRevenue",
      "getTransactionCategories",
      "getRecurringExpenses",
      "getEstablishmentActivities",
    ]),
    fetch() {
      const accountId = this.selectedAccounts.join(", ");
      const params = {
        accountId,
        start: this.from ? new Date(this.from).getTime() : undefined,
        end: this.to ? new Date(this.to).getTime() : undefined,
      };
      Promise.allSettled([
        this.getAccounts(),
        this.getTransactions(params),
        this.getNetIncome(params),
        this.getExpense(params),
        this.getRevenue(params),
        this.getTransactionCategories(params),
        this.getRecurringExpenses({
          accountId,
        }),
        this.getEstablishmentActivities(params),
      ]);
    },
  },
  created() {
    this.fetch();
  },
})
export default class Dashboard extends Vue {}
</script>

<style scoped>
.transaction-expense-categories {
  margin-top: 1em;
}
.transaction-expense-categories-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5em;
  flex-flow: row;
  border-bottom: 1px solid #ddd;
}
.transaction-expense-categories-item:last-child {
  border: none;
}
.percentage-change {
  font-size: 1.5em;
}
.transaction-expense-categories-item-info .category {
  color: #007cff;
  font-size: 1.2em;
}

/*responsive*/
@media (max-width: 991px) {
  .transaction-expense-categories {
    margin-bottom: 8em;
    margin-top: 0.5em;
  }
  .transaction-expense-categories-item-info .category {
    font-size: 1.1em;
  }
}
</style>
