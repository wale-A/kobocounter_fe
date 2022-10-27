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
            :highlight="$route?.params.id"
            @select="
              $router.push({
                name: 'BudgetDetail',
                params: { id: $event },
              })
            "
          />
        </template>
        <template v-slot:col-2> <Detail :budget="budget" /></template
      ></Columns>
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
      @cancel="add = false"
      @review="review($event)"
      @save="save($event)"
    />
    <Modal v-if="showModal" @action="showModal = false" />
  </Page>
</template>

<script lang="ts">
import { Options, mixins } from "vue-class-component";
import Columns from "@/components/layout/Columns.vue";
import Page from "@/components/layout/Page.vue";
import Filter from "@/components/common/Filter.vue";
import { FilterParams, BudgetListItem, Budget, BudgetPayload } from "@/types";
import { mapGetters, mapActions } from "vuex";
import { budgetFilter } from "@/util";
import FilterMixin from "@/mixins/Filter";
import Detail from "@/components/budget/Detail.vue";
import List from "@/components/budget/List.vue";
import Create from "@/components/budget/Create.vue";
import CTA from "@/components/common/CTA.vue";
import Modal from "@/components/common/Modal.vue";

@Options<Budgets>({
  components: {
    Columns,
    Filter,
    Page,
    Detail,
    List,
    CTA,
    Create,
    Modal,
  },
  computed: {
    ...mapGetters(["budget", "budgets", "categoryOptionsMap"]),
    isSingle() {
      return !!this.$route?.params.id;
    },
    id() {
      return this.$route?.params.id;
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
      console.log("budget", newVal);
      this.getBudget(newVal);
    },
  },
})
export default class Budgets extends mixins(FilterMixin) {
  budgets!: BudgetListItem[] | undefined;
  budget!: Budget | undefined;
  filterFields = budgetFilter;
  categoryOptionsMap!: Record<string, any>;
  add = false;
  loading = false;
  action = "add";
  model: BudgetPayload | null = null;
  showModal = false;

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

  review(model: BudgetPayload): void {
    this.model = model;
    this.action = "review";
  }

  save(model: BudgetPayload): void {
    if (!this.model) {
      return;
    }
    this.loading = true;
    this.postBudget(model)
      .then(() => {
        this.add = false;
        this.showModal = false;
      })
      .catch(() => {
        this.$notify({
          text: "Creating budget failed, please retry again",
          type: "error",
        });
      })
      .finally(() => (this.loading = false));
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
