<template>
  <div class="guageChartDiv" :style="{ height: '100%', width: '100%' }"></div>
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
      // outer pie chart
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
      // inner pie chart
      let pieSeries2 = chart.series.push(new am4charts.PieSeries());
      pieSeries2.dataFields.value = "value";
      pieSeries2.dataFields.category = "category";
      pieSeries2.slices.template.propertyFields.fill = "fill";
      pieSeries2.labels.template.fontSize = "0.8em";

      //   Add data
      this.budgetDetails.find(
        (x: { category: string; value: number; amount: number }) =>
          x.category === "Budget Left"
      ).fill = "#dedede";
      pieSeries2.data = this.budgetDetails;

      pieSeries.adapter.add("innerRadius", function () {
        return am4core.percent(40);
      });
      pieSeries.adapter.add("radius", function () {
        return am4core.percent(100);
      });
      pieSeries2.slices.template.tooltipText =
        "{category}: \n[bold]N {amount}[/]";
      pieSeries2.adapter.add("innerRadius", function () {
        return am4core.percent(60);
      });
      pieSeries2.adapter.add("radius", function () {
        return am4core.percent(80);
      });

      // Disable sliding out of slices
      const activeKeyOuterSeries =
        pieSeries.slices.template.states.getKey("active");
      if (activeKeyOuterSeries) activeKeyOuterSeries.properties.shiftRadius = 0;

      const hoverKeyOuterSeries =
        pieSeries.slices.template.states.getKey("hover");
      if (hoverKeyOuterSeries) hoverKeyOuterSeries.properties.scale = 1;

      const activeKeyInnerSeries =
        pieSeries2.slices.template.states.getKey("active");
      if (activeKeyInnerSeries) activeKeyInnerSeries.properties.shiftRadius = 0;

      const hoverKeyInnerSeries =
        pieSeries2.slices.template.states.getKey("hover");
      if (hoverKeyInnerSeries) hoverKeyInnerSeries.properties.scale = 1;
    },
  },
  watch: {
    budgetDetails() {
      this.draw();
    },
    // budgetSummary() {
    //   this.draw();
    // },
  },
})
export default class GuageChart extends Vue {}
</script>
