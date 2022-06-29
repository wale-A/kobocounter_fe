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
    <div class="transactions-page">
      <template v-if="onMobile && !isSingle && facets.length > 0">
        <Filter
          :fields="facets"
          :model="{ ...params }"
          @filter="setParams($event)"
          @update:account="addAccount"
        />
      </template>
      <section class="transactions-page__wrapper">
        <div
          class="transactions"
          :class="{
            'transactions--desktop': !onMobile,
            'transactions--mobile': onMobile,
          }"
        >
          <List
            v-if="!onMobile || !isSingle"
            :highlight="$route?.params.id"
            :transactions="groupedTransactions"
            :canLoadMore="canLoadMore"
            class="transactions__list"
            :class="{ 'transactions__list--desktop': !onMobile }"
            @select="
              $router.push({
                name: 'TransactionDetail',
                params: { id: $event, action: 'view' },
              })
            "
            @loadMore="loadMore"
          />
          <SingleTransaction
            v-if="!onMobile || isSingle"
            :transaction="transaction"
            :children="children"
            :parent="parent"
            :establishments="establishments"
            :action="action"
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
        </div>
      </section>
      <!-- <AddNewAccount :hasAccounts="!(accounts && accounts?.length == 0)" /> -->
    </div>
  </Page>
</template>

<script lang="ts">
import { Options, mixins } from "vue-class-component";
import { mapGetters, mapActions } from "vuex";
import Card from "@/components/layout/Card.vue";
import Page from "@/components/layout/Page.vue";
import AddNewAccount from "@/components/AddNewAccount.vue";
import {
  FilterParams,
  SplitTransaction,
  Transaction,
  TransactionModel,
} from "@/types";
import SingleTransaction from "@/components/transaction/SingleTransaction.vue";
import List from "@/components/transaction/List.vue";
import Filter from "@/components/common/Filter.vue";
import { transactionFilter } from "@/util";
import FilterMixin from "@/mixins/Filter";

@Options<Transactions>({
  components: {
    Card,
    Page,
    AddNewAccount,
    List,
    SingleTransaction,
    Filter,
  },
  computed: {
    ...mapGetters([
      "accounts",
      "categoryOptionsMap",
      "transactions",
      "groupedTransactions",
      "establishments",
      "transactionCategories",
      "canLoadMore",
      "nextPageParams",
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
    ]),
  },
  watch: {
    params(newVal) {
      this.fetch(this.getQuery(this.facets, newVal));
    },
  },
})
export default class Transactions extends mixins(FilterMixin) {
  singleTransaction: Transaction | null | undefined = null;
  parentTransaction: Transaction | null | undefined = null;
  childTransactions: Transaction[] | null = null;
  filterFields = transactionFilter;

  transactions!: Transaction[];
  categoryOptionsMap!: Record<string, any>;

  get filterArgs(): Record<string, any> {
    return {
      account: this.accountOptionsMap,
      category: this.categoryOptionsMap,
    };
  }

  getAccounts!: (params: FilterParams) => Promise<void>;
  getTransactions!: (params: FilterParams) => Promise<void>;
  getTransactionCategories!: (params: FilterParams) => Promise<void>;
  getEstablishments!: () => Promise<void>;

  fetch(params: FilterParams): void {
    Promise.allSettled([
      this.getAccounts(params),
      this.getTransactions(params),
      this.getEstablishments(),
      this.getTransactionCategories(params),
    ]);
  }

  updateTransaction!: (arg: {
    transactionId: string;
    model: {
      id: string;
      displayCategory: string;
      recipientName: string;
      isEstablishment: boolean;
      establishmentActivities: string[];
    };
  }) => Promise<void>;

  editTransaction(model: TransactionModel): void {
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
        });
      });
  }

  saveSplitTransactions!: (arg: {
    transactionId: string;
    payload: SplitTransaction[];
  }) => Promise<void>;

  splitTransaction(model: SplitTransaction[]): void {
    if (!this.singleTransaction) {
      return;
    }
    this.saveSplitTransactions({
      transactionId: this.singleTransaction.id,
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
      });
  }

  nextPageParams!: {
    page: number;
    size: number;
  };

  loadMore(): void {
    this.getTransactions({
      ...this.getQuery(this.facets, this.params),
      ...this.nextPageParams,
    });
  }

  created(): void {
    this.params = this.getModels(this.facets);
  }
}
</script>

<style lang="scss" scoped>
.transactions {
  @at-root #{&}--desktop {
    display: flex;
    justify-content: space-between;
    height: 85vh;
    padding: 30px;
  }

  @at-root #{&}--mobile {
    margin-bottom: 60px;
  }

  @at-root #{&}__list--desktop {
    width: 65.5%;
    overflow: auto;
  }

  @at-root #{&}__detail--desktop {
    width: 31.5%;
    overflow: auto;
  }
}
</style>
