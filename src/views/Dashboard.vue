<template>
  <Page>
    <template v-if="facets.length > 0" v-slot:actions>
      <Filter
        :displayText="paramSummary"
        :fields="facets"
        :model="{ ...params }"
        @filter="setParams($event)"
        @update:account="addAccount"
      />
    </template>
    <div>
      <section
        v-show="accounts?.length"
        class="dashboard"
        :class="{ 'dashboard--padding': !onMobile }"
      >
        <template v-if="onMobile && facets.length > 0">
          <Filter
            :fields="facets"
            :model="{ ...params }"
            @filter="setParams($event)"
            @update:account="addAccount"
          />
        </template>
        <div
          v-if="!onMobile"
          class="dashboard__widgets dashboard__widgets--desktop"
        >
          <div class="dashboard__widget-set dashboard__widget-set--first">
            <AccountActivity
              :fileName="'income_summary__' + from + '_to_' + to"
              :revenue="revenue"
              :expense="expense"
              class="dashboard__widget dashboard__widget--acount-activity"
            />
            <RecentCategories
              :transactionCategories="transactionCategories"
              :establishmentActivities="establishmentActivities"
              :to="to"
              :from="from"
              class="dashboard__widget dashboard__widget--recent-category"
            />
          </div>
          <div class="dashboard__widget-set dashboard__widget-set--second">
            <AccountSummary
              :accountBalance="accountBalance || 0"
              :totalRevenue="totalRevenue"
              :totalExpenses="totalExpenses"
              class="dashboard__widget dashboard__widget--acount-summary"
            />
            <BudgetPerformance
              :data="budgets"
              class="dashboard__widget dashboard__widget--budget-performance"
            />
            <UpcomingExpenses
              :expenses="recurrentExpenses"
              class="dashboard__widget dashboard__widget--acount-top-expenses dashboard__widget--acount-top-expenses--mobile"
            />
          </div>
        </div>
        <div v-else class="dashboard__widgets dashboard__widgets--mobile">
          <AccountSummary
            :accountBalance="accountBalance || 0"
            :totalRevenue="totalRevenue"
            :totalExpenses="totalExpenses"
            class="dashboard__widget dashboard__widget--acount-summary dashboard__widget--acount-summary--mobile"
          />
          <AccountActivity
            :fileName="'income_summary__' + from + '_to_' + to"
            :revenue="revenue"
            :expense="expense"
            class="dashboard__widget dashboard__widget--acount-activity dashboard__widget--acount-activity--mobile"
          />
          <BudgetPerformance
            :data="budgets"
            class="dashboard__widget dashboard__widget--budget-performance dashboard__widget--budget-performance--mobile"
          />

          <UpcomingExpenses
            :expenses="recurrentExpenses"
            class="dashboard__widget dashboard__widget--acount-top-expenses dashboard__widget--acount-top-expenses--mobile"
          />
          <RecentCategories
            :transactionCategories="transactionCategories"
            :establishmentActivities="establishmentActivities"
            :to="to"
            :from="from"
            class="dashboard__widget dashboard__widget--recent-category dashboard__widget--recent-category--mobile"
          />
        </div>
      </section>
      <AddNewAccount :hasAccounts="!(accounts && accounts?.length == 0)" />
    </div>

    <Loader v-show="!accounts" />
  </Page>
</template>

<script lang="ts">
import { Options, mixins } from "vue-class-component";
import { mapGetters, mapActions } from "vuex";
import AddNewAccount from "@/components/AddNewAccount.vue";
import AccountSummary from "@/components/dashlets/AccountSummary.vue";
import AccountActivity from "@/components/dashlets/AccountActivity.vue";
import RecentCategories from "@/components/dashlets/RecentCategories.vue";
import BudgetPerformance from "@/components/dashlets/BudgetPerformance.vue";
import Page from "@/components/layout/Page.vue";
import Loader from "@/components/layout/Loader.vue";
import Filter from "@/components/common/Filter.vue";
import { Account, FilterParams } from "@/types";
import FilterMixin from "@/mixins/Filter";
import UpcomingExpenses from "@/components/dashlets/UpcomingExpenses.vue";

@Options<Dashboard>({
  components: {
    AddNewAccount,
    Loader,
    Page,
    Filter,
    AccountSummary,
    AccountActivity,
    RecentCategories,
    BudgetPerformance,
    UpcomingExpenses,
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
      "budgets",
    ]),
    onMobile() {
      return ["xs", "sm", "md"].includes(this.$grid.breakpoint);
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
      "getBudgets",
    ]),
  },
  watch: {
    params: {
      handler(newVal) {
        this.fetch(this.getQuery(this.facets, newVal));
      },
      immediate: false,
    },
  },
})
export default class Dashboard extends mixins(FilterMixin) {
  accounts!: Record<string, any>[];
  revenue!: { amount: number }[];
  expense!: { amount: number }[];

  get totalRevenue(): string {
    const rev =
      this.revenue?.reduce(
        (acc: number, val: { amount: number }) => (acc += val.amount),
        0
      ) || 0;

    return rev.toLocaleString();
  }

  get totalExpenses(): string {
    const exp = Math.abs(
      this.expense?.reduce(
        (acc: number, val: { amount: number }) => (acc += val.amount),
        0
      ) || 0
    );
    return exp.toLocaleString();
  }

  get accountBalance(): string {
    const balance = (this.accounts as Account[])
      .reduce((sum, acct) => {
        return sum + (acct.balance || 0);
      }, 0)
      .toFixed(2);
    return parseFloat(balance).toLocaleString();
  }

  getAccounts!: (params: FilterParams) => Promise<void>;
  getTransactions!: (params: FilterParams) => Promise<void>;
  getNetIncome!: (params: FilterParams) => Promise<void>;
  getExpense!: (params: FilterParams) => Promise<void>;
  getRevenue!: (params: FilterParams) => Promise<void>;
  getTransactionCategories!: (params: FilterParams) => Promise<void>;
  getRecurringExpenses!: (params: FilterParams) => Promise<void>;
  getEstablishmentActivities!: (params: FilterParams) => Promise<void>;
  getBudgets!: (params: FilterParams) => Promise<void>;

  fetch(params: FilterParams): void {
    Promise.allSettled([
      this.getAccounts(params),
      this.getTransactions({ ...params, page: -1, size: -1 }),
      this.getNetIncome(params),
      this.getExpense(params),
      this.getRevenue(params),
      this.getTransactionCategories({ ...params, expenses: true }),
      this.getRecurringExpenses({
        accountId: params.accountId,
      }),
      this.getEstablishmentActivities(params),
      this.getBudgets(params),
    ]);
  }

  created(): void {
    this.params = this.getModels(this.facets);
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  display: block;
  height: auto;

  @at-root #{&}--padding {
    padding: 30px;
  }

  @at-root #{&}__widgets {
    display: flex;
  }

  @at-root #{&}__widgets--desktop {
    justify-content: space-between;
    height: 80vh;
  }

  @at-root #{&}__widgets--mobile {
    flex-direction: column;
    margin-bottom: 60px;
  }

  @at-root #{&}__widget-set {
    display: flex;
    flex-direction: column;
    align-content: space-between;
    justify-content: space-between;
  }

  @at-root #{&}__widget-set--first {
    width: 67.5%;
  }

  @at-root #{&}__widget-set--second {
    width: 30%;
  }

  @at-root #{&}__widget--acount-activity {
    height: 42%;
  }

  @at-root #{&}__widget--acount-activity--mobile {
    height: 300px;
  }

  @at-root #{&}__widget--recent-category {
    height: 55%;
  }

  @at-root #{&}__widget--recent-category--mobile {
    height: 400px;
  }

  @at-root #{&}__widget--acount-summary {
    max-height: 38%;
  }

  /*@at-root #{&}__widget--acount-summary--mobile {
    min-height: 295px;
  }*/

  @at-root #{&}__widget--budget-performance {
    height: 44%;
  }

  @at-root #{&}__widget--budget-performance--mobile {
    min-height: 127px;
  }

  @at-root #{&}__widget--acount-top-expenses {
    max-height: 42.5%;
  }

  /*@at-root #{&}__widget--acount-top-expenses--mobile {
    height: 206px;
  } */
}
</style>
