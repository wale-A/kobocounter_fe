<template>
  <Page :loading="loadingInsights">
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
          <Detail :insight="insight" :data="detailedInsights" /></template
      ></Columns>
      <CTA
        v-if="insights && insights.length === 0"
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
import { Options, mixins } from "vue-class-component";
import Columns from "@/components/layout/Columns.vue";
import Page from "@/components/layout/Page.vue";
import Filter from "@/components/common/Filter.vue";
import { FilterParams, Insights as InsightType } from "@/types";
import { mapGetters, mapActions, mapState } from "vuex";
import FilterMixin from "@/mixins/Filter";
import Detail from "@/components/insight/Detail.vue";
import List from "@/components/insight/List.vue";
import CTA from "@/components/common/CTA.vue";

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
    ...mapState([
      "loadingInsights",
      "loadingInsight",
      "insightsError",
      "insightError",
    ]),
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
    ...mapActions([
      "getAccounts",
      "getInsights",
      "getBudgets",
      "getDetailedInsights",
    ]),
  },
  watch: {
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
