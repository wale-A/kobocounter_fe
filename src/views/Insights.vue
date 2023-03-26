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
      <Columns v-if="insights && insights.length">
        <template v-slot:col-1>
          <List
            :keyValue="'id'"
            :insights="insights"
            :highlight="$route?.params.id"
            @select="
              $router.push({
                name: 'InsightDetail',
                params: { id: $event, action: 'view' },
              })
            "
          />
        </template>
        <template v-slot:col-2>
          <Detail
            :insight="insight"
            :data="detailedInsights"
            :loading="loadingInsight" /></template
      ></Columns>
      <CTA
        v-if="insights && insights.length === 0"
        title="Oops, we found no transactions to show insights on"
        subtext="Please adjust the filters, or add a bank account if you haven't."
        buttonLabel="Add Account"
        @action="
          $router.push({
            name: 'ManageAccounts',
          })
        "
      />
      <CTA
        v-if="insightsError"
        title="Oops"
        subtext="Couldn't load insights"
        buttonLabel="Try again"
        @action="refresh"
      />
    </div>
  </Page>
</template>

<script lang="ts">
import CTA from "@/components/common/CTA.vue";
import Filter from "@/components/common/Filter.vue";
import Detail from "@/components/insight/Detail.vue";
import List from "@/components/insight/List.vue";
import Columns from "@/components/layout/Columns.vue";
import Page from "@/components/layout/Page.vue";
import FilterMixin from "@/mixins/Filter";
import { FilterParams, Insights as InsightType } from "@/types";
import { Options, mixins } from "vue-class-component";
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";

@Options<Insights>({
  components: {
    Columns,
    Filter,
    Page,
    Detail,
    List,
    CTA,
  },
  computed: {
    ...mapState({
      loadingInsights: (state: any) => state.insights.loadingInsights,
      loadingInsight: (state: any) => state.insights.loadingInsight,
      insightsError: (state: any) => state.insights.insightsError,
      insightError: (state: any) => state.insights.insightError,
    }),
    ...mapGetters(["insights", "budgets", "detailedInsights"]),
    isSingle() {
      return this.$route?.params.id;
    },
    insight() {
      if (!this.$route?.params.id) {
        return null;
      }
      const val = this.insights.find(
        (x: InsightType) => x.id == this.$route.params.id
      );

      return val;
    },
    onMobile() {
      return ["xs", "sm", "md"].includes(this.$grid.breakpoint);
    },
  },
  methods: {
    ...mapMutations(["setLoading"]),
    ...mapActions([
      "getAccounts",
      "getInsights",
      "getBudgets",
      "getDetailedInsights",
    ]),
  },
  watch: {
    loadingInsights: {
      handler(newVal) {
        this.setLoading(newVal);
      },
      immediate: true,
    },
    params(newVal) {
      this.fetch(this.getQuery(this.facets, newVal));
    },
    insight(newVal) {
      this.getDetailedInsights({
        ...this.getQuery(this.facets, this.params),
        category: newVal?.category,
      });
    },
  },
})
export default class Insights extends mixins(FilterMixin) {
  insights!: InsightType[] | undefined;
  detailedInsights!: InsightType[] | undefined;
  displayChart = "piechart";

  getAccounts!: (params: FilterParams) => Promise<void>;
  getInsights!: (params: FilterParams) => Promise<void>;
  getBudgets!: (params: FilterParams) => Promise<void>;
  getDetailedInsights!: (
    params: FilterParams & { category?: string | number }
  ) => Promise<void>;

  fetch(params: FilterParams): void {
    Promise.allSettled([
      this.getAccounts(params),
      this.getInsights(params),
      this.getBudgets(params),
    ]);
  }

  refresh() {
    this.fetch(this.getQuery(this.facets, this.params));
  }

  created(): void {
    this.params = this.getModels(this.facets);
  }
}
</script>
