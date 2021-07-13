<template>
  <div id="wordCloudChartDiv" :style="{ height: height, width: width }"></div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4plugins_wordCloud from "@amcharts/amcharts4/plugins/wordCloud";

@Options({
  beforeUpdate() {
    this.draw();
  },
  props: {
    height: String,
    width: String,
    fileName: String,
    inputData: Array,
  },
  methods: {
    draw() {
      const chart = am4core.create(
        "wordCloudChartDiv",
        am4plugins_wordCloud.WordCloud
      );
      chart.fontFamily = "Poppins";
      chart.exporting.menu = new am4core.ExportMenu();
      chart.exporting.menu.items = [
        {
          label: "...",
          menu: [
            { type: "png", label: "PNG" },
            { type: "print", label: "PDF" },
          ],
        },
      ];
      const series = chart.series.push(
        new am4plugins_wordCloud.WordCloudSeries()
      );
      // series.randomness = 0.1;
      series.rotationThreshold = 15;
      series.data = (this.inputData || []).map(
        (x: { activity: string; transactionIds: [] }) => {
          return {
            tag: x.activity,
            count: x.transactionIds.length,
          };
        }
      );
      series.dataFields.word = "tag";
      series.dataFields.value = "count";

      series.colors = new am4core.ColorSet();
      series.colors.passOptions = {};
      series.colors.reuse = false;
      // series.heatRules.push({
      //   target: series.labels.template,
      //   property: "fill",
      //   min: am4core.color("#0000CC"),
      //   max: am4core.color("#CC00CC"),
      //   dataField: "value",
      // });
      series.labels.template.tooltipText = "{word}: \n[bold]{value}[/]";
      series.labels.template.tooltip = new am4core.Tooltip();
      series.labels.template.tooltip.fontFamily = "Poppins";
    },
  },
})
export default class WordCloudChart extends Vue {}
</script>
