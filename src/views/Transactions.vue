<template>
  <Page :loading="loadingTransactions">
    <template v-if="facets.length > 0" v-slot:actions>
      <Filter
        :displayText="paramSummary"
        :fields="facets"
        :model="{ ...params }"
        @filter="setParams($event)"
        @update:account="addAccount"
      />
    </template>
    <div class="page-body">
      <template v-if="onMobile && !isSingle && facets.length > 0">
        <Filter
          :fields="facets"
          :model="{ ...params }"
          @filter="setParams($event)"
          @update:account="addAccount"
        />
      </template>
      <Columns v-if="transactions && transactions.length">
        <template v-slot:col-1>
          <List
            :highlight="$route?.params.id"
            :transactions="groupedTransactions"
            :canLoadMore="canLoadMore"
            :loadingTransactions="loading"
            @select="
              $router.push({
                name: 'TransactionDetail',
                params: { id: $event, action: 'view' },
              })
            "
            @loadMore="loadMore"
          />
        </template>
        <template v-slot:col-2>
          <Detail
            :transaction="transaction"
            :children="children"
            :parent="parent"
            :establishments="establishments"
            :allExpenseCategories="allExpenseCategories"
            :allTransactionCategories="allTransactionCategories"
            :action="action"
            :loadingOperation="loading"
            class="transactions__detail"
            :class="{ 'transactions__detail--desktop': !onMobile }"
            @select="$router.push(`/transactions/${$event}/view`)"
            @edit="$router.push(`/transactions/${$event}/edit`)"
            @split="$router.push(`/transactions/${$event}/split`)"
            @cancel="$router.go(-1)"
            @addEstablishment="$store.commit('insertEstablishment', $event)"
            @addActivity="$store.commit('insertActivity', $event)"
            @saveEdit="editTransaction($event)"
            @saveSplit="splitTransaction($event)"
          />
        </template>
      </Columns>
      <CTA
        v-if="transactions && transactions.length === 0"
        title="Oops, we found nothing"
        subtext="Please adjust the filters or have you created a budget yet?"
        buttonLabel="Create Budget"
        @action="
          $router.push({
            name: 'Budgets',
          })
        "
      />
      <CTA
        v-if="transactionsError"
        title="Oops"
        subtext="Couldn't load transactions"
        buttonLabel="Try again"
        @action="refresh"
      />
    </div>
  </Page>
</template>

<script lang="ts">
import { Options, mixins } from "vue-class-component";
import { mapGetters, mapActions, mapState } from "vuex";
import Columns from "@/components/layout/Columns.vue";
import Page from "@/components/layout/Page.vue";
import AddNewAccount from "@/components/AddNewAccount.vue";
import CTA from "@/components/common/CTA.vue";
import {
  FilterParams,
  SplitTransaction,
  Transaction,
  TransactionPayload,
} from "@/types";
import Detail from "@/components/transaction/Detail.vue";
import List from "@/components/transaction/List.vue";
import Filter from "@/components/common/Filter.vue";
import { transactionFilter } from "@/util";
import FilterMixin from "@/mixins/Filter";

@Options<Transactions>({
  components: {
    Columns,
    Page,
    AddNewAccount,
    List,
    Detail,
    Filter,
    CTA,
  },
  computed: {
    ...mapState(["loadingTransactions", "transactionsError"]),
    ...mapGetters([
      "accounts",
      "categoryOptionsMap",
      "transactions",
      "groupedTransactions",
      "establishments",
      "transactionCategories",
      "canLoadMore",
      "nextPageParams",
      "allExpenseCategories",
      "allTransactionCategories",
    ]),
    isSingle() {
      return this.$route?.params.id;
    },
    action() {
      if (this.$route?.params.id && this.$route?.params.action) {
        return this.$route.params.action;
      }
      return "";
    },
    transaction() {
      if (!this.$route?.params.id) {
        return null;
      }
      return this.transactions.find(
        (x: Transaction) => x.id === this.$route.params.id
      );
    },
    children() {
      if (!this.transaction) {
        return null;
      }
      return this.transactions?.filter(
        (x: Transaction) => x.parentId === this.transaction.id
      );
    },
    parent() {
      if (!this.transaction) {
        return null;
      }
      return this.transactions?.find(
        (x: Transaction) => x.id === this.transaction.parentId
      );
    },
    onMobile() {
      return ["xs", "sm", "md"].includes(this.$grid.breakpoint);
    },
  },
  methods: {
    ...mapActions([
      "getAccounts",
      "getTransactions",
      "updateTransaction",
      "saveSplitTransactions",
      "getEstablishments",
      "getTransactionCategories",
      "getAllExpenseCategories",
      "getAllTransactionCategories",
    ]),
  },
  watch: {
    params(newVal) {
      this.fetch(this.getQuery(this.facets, newVal));
    },
  },
})
export default class Transactions extends mixins(FilterMixin) {
  transaction!: Transaction | null | undefined;
  parentTransaction: Transaction | null | undefined = null;
  childTransactions: Transaction[] | null = null;
  filterFields = transactionFilter;
  transactions!: Transaction[];
  categoryOptionsMap!: Record<string, any>;
  allTransactionCategories!: Array<{ value: number; label: string }>;
  loading = false;

  get filterArgs(): Record<string, any> {
    return {
      account: this.accountOptionsMap,
      category: this.categoryOptionsMap,
    };
  }

  get paramSummary(): string {
    if (this.params) {
      const bank = this.accountMap[this.params.account]
        ? `${this.accountMap[this.params.account].bankName} Account`
        : "All Bank Accounts";
      const search = this.params.search
        ? `
          with transactions containing '${this.params.search}'
        `
        : "";
      return `Showing results for ${bank} from ${this.from} to ${this.to} ${search}`;
    }
    return "";
  }

  getAccounts!: (params: FilterParams) => Promise<void>;
  getTransactions!: (params: FilterParams) => Promise<void>;
  getTransactionCategories!: (params: FilterParams) => Promise<void>;
  getEstablishments!: () => Promise<void>;
  getAllExpenseCategories!: () => Promise<void>;
  getAllTransactionCategories!: () => Promise<void>;

  updateTransaction!: (arg: {
    transactionId: string;
    model: TransactionPayload;
  }) => Promise<void>;

  editTransaction(model: TransactionPayload): void {
    this.loading = true;
    this.updateTransaction({
      transactionId: model.id,
      model: {
        ...model,
        recipientName: model.recipientName[0],
      },
    })
      .then(() => {
        this.$notify({
          text: "Transaction update was successful",
          type: "success",
        });
        this.$router.go(-1);
      })
      .catch(() => {
        this.$notify({
          text: "Transaction update failed, please retry",
          type: "error",
          duration: 10000,
        });
      })
      .finally(() => (this.loading = false));
  }

  saveSplitTransactions!: (arg: {
    transactionId: string;
    payload: SplitTransaction[];
  }) => Promise<void>;

  splitTransaction(model: SplitTransaction[]): void {
    if (!this.transaction) {
      return;
    }
    this.loading = true;
    this.saveSplitTransactions({
      transactionId: this.transaction.id,
      payload: model,
    })
      .then(() => {
        this.$notify({
          text: "Transaction split was successful",
          type: "success",
        });
        this.$router.go(-1);
      })
      .catch(() => {
        this.$notify({
          text: "Transaction split failed, please retry",
          type: "error",
        });
      })
      .finally(() => (this.loading = false));
  }

  nextPageParams!: {
    page: number;
    size: number;
  };

  loadMore(): void {
    this.loading = true;
    this.getTransactions({
      ...this.getQuery(this.facets, this.params),
      ...this.nextPageParams,
    }).finally(() => (this.loading = false));
  }

  fetch(params: FilterParams): void {
    this.loading = true;
    Promise.allSettled([
      this.getAccounts(params),
      this.getTransactions(params),
      this.getEstablishments(),
      this.getTransactionCategories(params),
    ]).finally(() => (this.loading = false));
  }

  fetchTransactionAndExpensesCategories(): void {
    Promise.allSettled([
      this.getAllExpenseCategories(),
      this.getAllTransactionCategories(),
    ]);
  }

  refresh() {
    this.fetch(this.getQuery(this.facets, this.params));
  }

  created(): void {
    this.params = this.getModels(this.facets);
    this.fetchTransactionAndExpensesCategories();
  }
}
</script>
