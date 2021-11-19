<template>
  <div class="guageChartDiv" :style="{ height: height, width: width }"></div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

@Options({
  created() {
    this.draw();
  },
  props: {
    height: String,
    width: String,
    fileName: String,
    budgetSummary: Array,
    budgetDetails: Array,
  },
  methods: {
    draw() {
      /* Chart code */
      // Themes begin
      am4core.useTheme(am4themes_animated);
      // Themes end

      // Create chart instance
      let chart = am4core.create("guageChartDiv", am4charts.PieChart);
      // Let's cut a hole in our Pie chart the size of 40% the radius
      chart.innerRadius = am4core.percent(40);

      // Add and configure Series
      let pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = "value";
      pieSeries.dataFields.category = "category";
      pieSeries.slices.template.stroke = am4core.color("#fff");
      pieSeries.innerRadius = 10;
      pieSeries.slices.template.fillOpacity = 0.5;

      pieSeries.slices.template.propertyFields.disabled = "labelDisabled";
      pieSeries.labels.template.propertyFields.disabled = "labelDisabled";
      pieSeries.ticks.template.propertyFields.disabled = "labelDisabled";
      pieSeries.labels.template.disabled = true;
      // Add data
      this.budgetSummary.find(
        (x: { category: string; value: number; amount: number }) =>
          x.category === "Budget Left"
      ).labelDisabled = true;
      pieSeries.data = this.budgetSummary;

      //   Add second series
      let pieSeries2 = chart.series.push(new am4charts.PieSeries());
      pieSeries2.dataFields.value = "value";
      pieSeries2.dataFields.category = "category";
      pieSeries2.slices.template.propertyFields.fill = "fill";
      pieSeries2.labels.template.fontSize = "1em";

      //   Add data
      this.budgetDetails.find(
        (x: { category: string; value: number; amount: number }) =>
          x.category === "Budget Left"
      ).fill = "#dedede";
      pieSeries2.data = this.budgetDetails;

      pieSeries.adapter.add("innerRadius", function (innerRadius, target) {
        return am4core.percent(40);
      });
      pieSeries.adapter.add("radius", function (innerRadius, target) {
        return am4core.percent(100);
      });
      pieSeries2.slices.template.tooltipText =
        "{category}: \n[bold]N {amount}[/]";
      pieSeries2.adapter.add("innerRadius", function (innerRadius, target) {
        return am4core.percent(60);
      });
      pieSeries2.adapter.add("radius", function (innerRadius, target) {
        return am4core.percent(80);
      });

      // Disable sliding out of slices
      pieSeries.slices.template.states.getKey(
        "active"
      )!.properties.shiftRadius = 0;
      pieSeries.slices.template.states.getKey("hover")!.properties.scale = 1;
      pieSeries2.slices.template.states.getKey(
        "active"
      )!.properties.shiftRadius = 0;
      pieSeries2.slices.template.states.getKey("hover")!.properties.scale = 1;
    },
  },
  watch: {
    budgetDetails() {
      console.log("watchin..............");
      this.draw();
    },
    budgetSummary() {
      console.log("watchin..............");
      this.draw();
    },
  },
})
export default class GuageChart extends Vue {}
</script>
