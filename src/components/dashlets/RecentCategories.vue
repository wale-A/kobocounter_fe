<template>
  <Card title="Recent categories">
    <template #action>
      <div>
        <span
          class="material-icons input-left-icon"
          @click="() => (displayChart = 'wordcloud')"
          :enabled="displayChart === 'wordcloud'"
          style="font-size: 1.5em"
        >
          chevron_left
        </span>
        <span>&nbsp;</span>
        <span
          class="material-icons input-left-icon"
          @click="() => (displayChart = 'piechart')"
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
      v-show="displayChart === 'piechart'"
    />
  </Card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Card from "@/components/layout/Card.vue";
import DonutChart from "@/components/charts/DonutChart.vue";
import WordCloudChart from "@/components/charts/WordCloudChart.vue";

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
  },
})
export default class RecentCategories extends Vue {
  displayChart = "piechart";
}
</script>
