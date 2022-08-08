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
      />
    </div>
  </Page>
</template>

<script lang="ts">
import { Options, mixins } from "vue-class-component";
import Columns from "@/components/layout/Columns.vue";
import Page from "@/components/layout/Page.vue";
import Filter from "@/components/common/Filter.vue";
import { FilterParams, BudgetListItem, Budget } from "@/types";
import { mapGetters, mapActions } from "vuex";
import FilterMixin from "@/mixins/Filter";
import Detail from "@/components/budget/Detail.vue";
import List from "@/components/budget/List.vue";
import CTA from "@/components/common/CTA.vue";

@Options<Budgets>({
  components: {
    Columns,
    Filter,
    Page,
    Detail,
    List,
    CTA,
  },
  computed: {
    ...mapGetters(["budget", "budgets"]),
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

  getAccounts!: (params: FilterParams) => Promise<void>;
  getBudgets!: (params: FilterParams) => Promise<void>;
  getBudget!: (id: string) => Promise<void>;

  fetch(params: FilterParams): void {
    Promise.allSettled([this.getAccounts(params), this.getBudgets(params)]);
  }

  created(): void {
    this.params = this.getModels(this.facets);
    this.fetch(this.getQuery(this.facets, this.params));
  }
}
</script>
