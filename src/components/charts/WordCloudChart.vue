<template>
  <div
    class="wordCloudChartDiv"
    :style="{ height: '100%', width: '100%' }"
  ></div>
</template>

<script lang="ts">
import * as am4core from "@amcharts/amcharts4/core";
import * as am4plugins_wordCloud from "@amcharts/amcharts4/plugins/wordCloud";
import { Options, Vue } from "vue-class-component";

@Options({
  mounted() {
    this.draw();
  },
  props: {
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

      /**
       *  This code block adds the download option to the chart,
       *  allowing users download png image or pdf file
       */
      // chart.exporting.menu = new am4core.ExportMenu();
      // chart.exporting.menu.items = [
      //   {
      //     label: "...",
      //     menu: [
      //       { type: "png", label: "PNG" },
      //       { type: "print", label: "PDF" },
      //     ],
      //   },
      // ];
      const series = chart.series.push(
        new am4plugins_wordCloud.WordCloudSeries()
      );
      // series.randomness = 0.1;
      series.accuracy = 5;
      series.minFontSize = am4core.percent(4);
      series.maxFontSize = am4core.percent(20);
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
