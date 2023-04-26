<template>
  <Page>
    <template v-if="facets.length > 0" v-slot:actions>
      <Filter
        :displayText="paramSummary"
        :fields="facets"
        :model="{ ...filters }"
        @filter="setParams($event)"
        @update:account="addAccount"
      />
    </template>
    <div class="page-body">
      <template v-if="onMobile && !isSingle && facets.length > 0">
        <Filter
          :fields="facets"
          :model="{ ...filters }"
          @filter="setParams($event)"
          @update:account="addAccount"
        />
      </template>
      <Columns v-if="budgets && budgets.length > 0">
        <template v-slot:col-1>
          <List
            :keyValue="'id'"
            :budgets="budgets"
            :showEdit="!!canEdit"
            :highlight="id"
            @select="
              $router.push({
                name: 'BudgetDetail',
                params: { id: $event },
              })
            "
            @edit="editBudgetItem"
            @delete="deleteBudgetItem"
          />
        </template>
        <template v-slot:col-2>
          <Detail
            :budget="budgetDetail"
            :loading="loadingBudget"
            :categories="categoryOptionsMap"
          />
        </template>
      </Columns>
      <CTA
        v-if="budgets && budgets.length === 0"
        title="You have not created a budget"
        subtext="You will see a list of your budgets on this page once they are created"
        buttonLabel="Create Budget"
        @action="add = true"
      />
      <CTA
        v-if="budgetsError"
        title="Oops"
        subtext="Couldn't load budgets"
        buttonLabel="Try again"
        @action="refresh"
      />
    </div>
    <Create
      v-if="add"
      :action="action"
      :categories="categoryOptionsMap"
      :budget="model"
      :lastBudget="lastBudget"
      :loading="loading"
      :editing="editing"
      @cancel="cancel"
      @edit="edit"
      @review="review"
      @save="save"
      @close="close"
    />
    <AddButton :title="'Add budget'" @add="add = true" />
  </Page>
</template>

<script lang="ts">
import AddButton from "@/components/AddButton.vue";
import Create from "@/components/budget/Create.vue";
import Detail from "@/components/budget/Detail.vue";
import List from "@/components/budget/List.vue";
import CTA from "@/components/common/CTA.vue";
import Filter from "@/components/common/Filter.vue";
import Columns from "@/components/layout/Columns.vue";
import Page from "@/components/layout/Page.vue";
import FilterMixin from "@/mixins/Filter";
import { Budget, BudgetListItem, BudgetPayload, FilterParams } from "@/types";
import { budgetFilter } from "@/util";
import { differenceInMonths, startOfMonth } from "date-fns";
import { Options, mixins } from "vue-class-component";
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";

@Options<Budgets>({
  components: {
    Columns,
    Filter,
    Page,
    Detail,
    List,
    CTA,
    Create,
    AddButton,
  },
  computed: {
    ...mapState({
      loadingBudget: (state: any) => state.budgets.loadingBudget,
      budgetError: (state: any) => state.budgets.budgetError,
      loadingBudgets: (state: any) => state.budgets.loadingBudgets,
      budgetsError: (state: any) => state.budgets.budgetsError,
    }),
    ...mapGetters([
      "budget",
      "budgets",
      "budgetMap",
      "lastBudget",
      "categoryOptionsMap",
    ]),
    isSingle() {
      return !!this.$route?.params.id;
    },
    id() {
      return this.$route?.params.id;
    },
    canEdit() {
      if (!this.id || !this.budget) {
        return false;
      }
      return (
        this.id === this.budget.id &&
        differenceInMonths(
          new Date(this.budget.endDate),
          startOfMonth(new Date())
        )
      );
    },
    budgetDetail() {
      if (!this.id || !this.budget) {
        return null;
      }
      return {
        ...this.budgetMap[this.id],
        items: [...(this.budget?.items || [])],
      };
    },
    onMobile() {
      return ["xs", "sm", "md"].includes(this.$grid.breakpoint);
    },
  },
  methods: {
    ...mapMutations(["setLoading"]),
    ...mapActions([
      "getAccounts",
      "getBudgets",
      "getBudget",
      "putBudget",
      "postBudget",
      "deleteBudget",
      "getAllTransactionCategories",
      "getAllExpenseCategories",
    ]),
  },
  watch: {
    loadingBudgets: {
      handler(newVal) {
        this.setLoading(newVal);
      },
      immediate: true,
    },
    filters(newVal) {
      this.fetch(this.getQuery(this.facets, newVal));
    },
    id: {
      handler(newVal) {
        this.getBudget(newVal);
      },
      immediate: true,
    },
  },
})
export default class Budgets extends mixins(FilterMixin) {
  budgets!: BudgetListItem[] | undefined;
  loadingbudgets!: boolean;
  budgetError!: Error | undefined;
  budget!: Budget | undefined;
  loadingbudget!: boolean;
  budgetsError!: Error | undefined;
  budgetMap!: Record<string, BudgetListItem>;
  lastBudget!: BudgetListItem | undefined;
  filterFields = budgetFilter;
  categoryOptionsMap!: Record<string, any>;
  add = false;
  loading = false;
  action = "add";
  model: BudgetPayload | null = null;
  editing = false;
  budgetDetail!: (BudgetListItem & Budget) | undefined;

  get filterArgs(): Record<string, any> {
    return {
      category: this.categoryOptionsMap,
    };
  }

  get paramSummary(): string {
    if (this.filters) {
      const categorySuffix = this.filters.category
        ? `
          for '${this.filters.category}'
        `
        : "";
      return `Showing budgets from ${this.from} to ${this.to} ${categorySuffix}`;
    }
    return "";
  }

  getAllExpenseCategories!: () => Promise<void>;
  getAllTransactionCategories!: () => Promise<void>;
  getBudgets!: (params: FilterParams) => Promise<void>;
  getBudget!: (id: string) => Promise<void>;
  postBudget!: (payload: BudgetPayload) => Promise<void>;
  putBudget!: ({
    id,
    payload,
  }: {
    id: string;
    payload: BudgetPayload;
  }) => Promise<void>;
  deleteBudget!: (id: string) => Promise<void>;
  transformBudget(budget: Budget | null): BudgetPayload | null {
    if (!budget) return null;
    const { startDate, endDate, items } = budget;
    return {
      startDate,
      endDate,
      items: items.map((item) => {
        const { category, value } = item;
        return { category, value };
      }),
    };
  }

  editBudgetItem(id: string): void {
    // TODO: ensure budget is ready before edit is called
    if (!this.budget) {
      return;
    }
    this.model = this.transformBudget(this.budget);
    this.action = "add";
    this.editing = true;
    this.add = true;
  }

  deleteBudgetItem(id: string): void {
    if (
      !confirm(
        `Are you sure you want to delete ${this.budgetDetail?.name} budget`
      )
    ) {
      return;
    }
    this.loading = true;
    this.deleteBudget(id)
      .then(() => {
        this.$notify({
          text: "Budget removed successfully",
          type: "success",
        });
        this.refresh();
      })
      .catch(() => {
        this.$notify({
          text: "Couldn't delete budget, please retry again",
          type: "error",
        });
      })
      .finally(() => (this.loading = false));
  }

  edit(model: BudgetPayload): void {
    this.model = model;
    this.action = "add";
  }

  review(model: BudgetPayload): void {
    this.model = model;
    this.action = "review";
  }

  cancel(): void {
    this.model = null;
    this.editing = false;
    this.add = false;
  }

  save(payload: BudgetPayload): void {
    if (!payload) {
      return;
    }
    if (this.editing) {
      this.budget?.id && this.put(this.budget.id, payload);
    } else {
      this.post(payload);
    }
  }

  post(payload: BudgetPayload): void {
    this.loading = true;
    this.postBudget(payload)
      .then((res) => {
        this.action = "status";
      })
      .catch(() => {
        this.$notify({
          text: "Creating budget failed, please retry again",
          type: "error",
        });
      })
      .finally(() => (this.loading = false));
  }

  put(id: string, payload: BudgetPayload): void {
    this.loading = true;
    this.putBudget({ id, payload })
      .then((res) => {
        this.action = "status";
      })
      .catch(() => {
        this.$notify({
          text: "Creating budget failed, please retry again",
          type: "error",
        });
      })
      .finally(() => (this.loading = false));
  }

  close() {
    this.add = false;
    this.action = "add";
    this.model = null;
    this.refresh();
  }

  refresh() {
    this.getBudgets(this.getQuery(this.facets, this.filters));
  }

  fetch(params: FilterParams): void {
    Promise.allSettled([
      this.getAllExpenseCategories(),
      this.getAllTransactionCategories(),
      this.getBudgets(params),
    ]);
  }

  created(): void {
    const params = this.getModels(this.facets);
    this.setParams(params);
    this.fetch(this.getQuery(this.facets, params));
  }
}
</script>
