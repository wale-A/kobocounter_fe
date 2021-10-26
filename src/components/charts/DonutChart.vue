<template>
  <div class="donutChartDiv" :style="{ height: height, width: width }"></div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";

@Options({
  props: {
    inputData: {
      type: Object,
    },
    click: Function,
    height: String,
    width: String,
    fileName: String,
  },
  methods: {
    draw(chartData: [] | null) {
      const chart = am4core.create("donutChartDiv", am4charts.PieChart3D);
      chart.hiddenState.properties.opacity = 0;
      chart.responsive.enabled = true;
      chart.data = chartData || [];
      chart.innerRadius = am4core.percent(40);
      chart.fontFamily = "Poppins";
      chart.fontSize = "0.8em";

      chart.legend = new am4charts.Legend();
      chart.legend.position = "bottom";
      chart.legend.valueLabels.template.align = "left";
      chart.legend.valueLabels.template.textAlign = "start";
      chart.legend.scrollable = true;

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
      // chart.exporting.title = "category";
      // chart.exporting.filePrefix = this.fileName;

      const series = chart.series.push(new am4charts.PieSeries3D());
      series.slices.template.fontFamily = "Poppins";
      series.dataFields.value = "amount";
      series.dataFields.category = "category";
      series.slices.template.tooltipText = "{category}: \n[bold]N {amount}[/]";
      series.slices.template.stroke = am4core.color("#fff");
      series.slices.template.strokeWidth = 2;
      series.slices.template.strokeOpacity = 1;

      series.tooltip = new am4core.Tooltip();
      series.tooltip.fontFamily = "Poppins";
      series.tooltip.exportable = true;

      series.labels.template.disabled = false;
      series.labels.template.wrap = true;
      series.ticks.template.disabled = false;
      series.legendSettings.itemValueText = "[bold]N {amount}[/]";
      series.slices.template.fillOpacity = 1;

      const hs = series.slices.template.states.getKey("hover");
      if (!hs) return;
      hs.properties.fillOpacity = 0.8;
      // series.labels.template.wrap = true;
      // series.labels.template.maxWidth = 100;
      // series.alignLabels = false;
      // series.slices.template.textDecoration.replaceAll(" ", "<br/>");

      chart.responsive.enabled = true;
      chart.responsive.rules.push({
        relevant: am4core.ResponsiveBreakpoints.widthL,
        state: (target, stateId) => {
          if (target instanceof am4charts.PieSeries3D) {
            const state = target.states.create(stateId);
            target.labels.template.states.create(
              stateId
            ).properties.disabled = true;
            target.ticks.template.states.create(
              stateId
            ).properties.disabled = true;
            return state;
          }
          if (target instanceof am4charts.PieChart3D) {
            const state = target.states.create(stateId);
            const legendProperties = target.legend.states.create(stateId)
              .properties;
            legendProperties.position = "top";
            legendProperties.fontSize = 13;
            legendProperties.paddingBottom = legendProperties.paddingTop = 0;
            legendProperties.marginTop = legendProperties.marginBottom = 0;
            legendProperties.maxHeight = 150;
            return state;
          }
        },
      });
      chart.responsive.rules.push({
        relevant: am4core.ResponsiveBreakpoints.widthXL,
        state: (target, stateId) => {
          if (target instanceof am4charts.PieChart3D) {
            const state = target.states.create(stateId);
            const legendProperties = target.legend.states.create(stateId)
              .properties;
            legendProperties.position = "bottom";
            return state;
          }
          if (target instanceof am4charts.PieSeries3D) {
            const state = target.states.create(stateId);
            const labelProperties = target.labels.template.states.create(
              stateId
            ).properties;
            labelProperties.marginLeft = labelProperties.marginRight = labelProperties.paddingLeft = labelProperties.paddingRight = 0;
            labelProperties.fontSize = 13;
            labelProperties.maxWidth = 150;
            const tickProperties = target.ticks.template.states.create(stateId)
              .properties;
            tickProperties.maxWidth = 5;
            return state;
          }
        },
      });
    },
  },
  watch: {
    inputData() {
      const data = this.inputData?.map((x: any) => {
        return { category: x.displayCategory, amount: x.amount };
      });
      this.draw(data);
    },
  },
})
export default class DonutChart extends Vue {}
</script>
