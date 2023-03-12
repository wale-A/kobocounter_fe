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
    <div class="page-body">
      <template v-if="onMobile && !isSingle && facets.length > 0">
        <Filter
          :fields="facets"
          :model="{ ...params }"
          @filter="setParams($event)"
          @update:account="addAccount"
        />
      </template>
      <Columns v-if="budgets && budgets.length > 0">
        <template v-slot:col-1>
          <List
            :keyValue="'id'"
            :budgets="budgets"
            :showEdit="canEdit"
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
          <Detail :budget="budgetDetail" />
        </template>
      </Columns>
      <CTA
        v-else
        title="You have not created a budget"
        subtext="You will see a list of your budgets on this page once they are created"
        buttonLabel="Create Budget"
        @action="add = true"
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
import { Options, mixins } from "vue-class-component";
import { mapActions, mapGetters } from "vuex";

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
      return this.id === this.budget?.id;
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
    ...mapActions([
      "getAccounts",
      "getBudgets",
      "getBudget",
      "putBudget",
      "postBudget",
      "deleteBudget",
      "getAllExpenseCategories",
    ]),
  },
  watch: {
    params(newVal) {
      this.fetch(this.getQuery(this.facets, newVal));
    },
    id(newVal) {
      this.getBudget(newVal);
    },
  },
})
export default class Budgets extends mixins(FilterMixin) {
  budgets!: BudgetListItem[] | undefined;
  budget!: Budget | null;
  budgetMap!: Record<string, BudgetListItem>;
  lastBudget!: BudgetListItem | undefined;
  filterFields = budgetFilter;
  categoryOptionsMap!: Record<string, any>;
  add = false;
  loading = false;
  action = "add";
  model: BudgetPayload | null = null;
  editing = false;

  get filterArgs(): Record<string, any> {
    return {
      category: this.categoryOptionsMap,
    };
  }

  get paramSummary(): string {
    if (this.params) {
      const categorySuffix = this.params.category
        ? `
          for '${this.params.category}'
        `
        : "";
      return `Showing budgets from ${this.from} to ${this.to} ${categorySuffix}`;
    }
    return "";
  }

  getAllExpenseCategories!: () => Promise<void>;
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
    this.model = this.transformBudget(this.budget);
    this.action = "add";
    this.editing = true;
    this.add = true;
  }

  deleteBudgetItem(id: string): void {
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
    this.getBudgets(this.getQuery(this.facets, this.params));
  }

  fetch(params: FilterParams): void {
    Promise.allSettled([
      this.getAllExpenseCategories(),
      this.getBudgets(params),
    ]);
  }

  created(): void {
    this.params = this.getModels(this.facets);
    this.fetch(this.getQuery(this.facets, this.params));
  }
}
</script>
