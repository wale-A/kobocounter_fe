<template>
  <Card title="Transaction Categories" :loading="loading" :error="error">
    <template #action>
      <div>
        <span
          :class="{
            'material-icons': true,
            'input-left-icon': true,
            active: donutChartSelected,
          }"
          @click="
            () => {
              displayChart = 'wordcloud';
              donutChartSelected = false;
            }
          "
          :enabled="displayChart === 'wordcloud'"
          :disabled="!establishmentActivities.length"
          style="font-size: 1.5em"
        >
          chevron_left
        </span>
        <span>&nbsp;</span>
        <span
          :class="{
            'material-icons': true,
            'input-left-icon': true,
            active: !donutChartSelected,
          }"
          @click="
            () => {
              displayChart = 'piechart';
              donutChartSelected = true;
            }
          "
          :enabled="displayChart === 'piechart'"
          style="font-size: 1.5em"
        >
          chevron_right
        </span>
      </div>
    </template>
    <WordCloudChart
      :height="height"
      :inputData="establishmentActivities"
      :width="'98%'"
      :fileName="'spending pattern'"
      v-show="displayChart === 'wordcloud'"
    />
    <DonutChart
      :height="height"
      :inputData="transactionCategories"
      :width="'98%'"
      :fileName="'spending_category_summary__' + from + '_to_' + to"
      :clickHandler="clickHandler"
      :categories="categories"
      v-show="displayChart === 'piechart'"
    />
  </Card>
</template>

<script lang="ts">
import DonutChart from "@/components/charts/DonutChart.vue";
import WordCloudChart from "@/components/charts/WordCloudChart.vue";
import Card from "@/components/layout/Card.vue";
import { Options, Vue } from "vue-class-component";

@Options({
  components: {
    Card,
    DonutChart,
    WordCloudChart,
  },
  props: {
    establishmentActivities: Array,
    transactionCategories: Array,
    from: String,
    to: String,
    height: String,
    loading: Boolean,
    error: Error,
    clickHandler: Function,
    categories: Array,
  },
})
export default class RecentCategories extends Vue {
  displayChart = "piechart";
  donutChartSelected = true;
}
</script>

<style scoped>
.input-left-icon.active {
  color: turquoise;
  cursor: pointer;
  display: unset;
}
.input-left-icon {
  display: none;
}

span[disabled="true"] {
  display: none !important;
}
</style>
