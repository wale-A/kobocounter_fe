<template>
  <div
    class="insightHistory"
    :style="{
      height: '35vh',
      width: '100%',
      marginTop: '2em',
      marginBottom: '1em',
    }"
  ></div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import { DetailedInsights } from "@/types";

@Options({
  props: {
    data: Object,
    fileName: String,
  },
  methods: {
    draw() {
      const chart = am4core.create("insightHistory", am4charts.XYChart);
      const chartData: DetailedInsights = this.data;
      chart.responsive.enabled = true;
      chart.cursor = new am4charts.XYCursor();
      chart.hiddenState.properties.opacity = 0;

      const dates = [
        ...new Set([
          ...chartData.budget.map((x) => x.date),
          ...chartData.transactions.map((x) => x.date),
        ]),
      ];
      chart.data = dates.map((date) => {
        return {
          date,
          budget: chartData.budget.find((x) => x.date == date)?.amount || 0,
          expense:
            chartData.transactions.find((x) => x.date == date)?.amount || 0,
        };
      });

      const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.grid.template.location = 0;
      dateAxis.renderer.minGridDistance = 40;
      dateAxis.fontSize = "0.8em";
      dateAxis.baseInterval = { timeUnit: "month", count: 1 };

      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      // display the lines for the horizontal axis and not the vertical axis
      dateAxis.renderer.grid.template.disabled = true;
      valueAxis.renderer.grid.template.disabled = false;
      // hides the X and Y axis lines, set value to 1 to show axis
      dateAxis.renderer.line.strokeOpacity = 0;
      valueAxis.renderer.line.strokeOpacity = 0;

      dateAxis.fontFamily = "Poppins";
      valueAxis.fontFamily = "Poppins";

      function createSeries(field: string, title: string, color: string) {
        const series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueY = field;
        series.dataFields.dateX = "date";
        series.name = title;
        series.tooltipText = "{dateX}: [bold]N {valueY}[/]";
        series.fontSize = "1em";
        series.strokeWidth = 1;
        series.fill = am4core.color(color);
        series.stroke = am4core.color(color);
        series.columns.template.fillOpacity = 0.8;
        series.fontFamily = "Poppins";
        series.tooltip = new am4core.Tooltip();
        series.tooltip.fontFamily = "Poppins";
        return series;
      }

      createSeries("expense", "Actual Spend", "#007CFF");
      createSeries("budget", "Budgeted Amount", "#CCE4FF");

      chart.legend = new am4charts.Legend();
      chart.legend.position = "bottom";
      chart.scrollbarX = new am4core.Scrollbar();
      chart.scrollbarX.properties.disabled = true;

      chart.fontFamily = "Poppins";
      chart.fontSize = "14";

      chart.responsive.rules.push({
        relevant: am4core.ResponsiveBreakpoints.widthL,
        state: (target, stateId) => {
          if (target instanceof am4charts.AxisRendererY) {
            const state = target.states.create(stateId);
            state.properties.inside = true;
            state.properties.maxLabelPosition = 0.99;
            return state;
          }

          if (
            target instanceof am4charts.AxisLabel &&
            target.parent instanceof am4charts.AxisRendererY
          ) {
            const state = target.states.create(stateId);
            state.properties.dy = -15;
            state.properties.paddingTop = 3;
            state.properties.paddingRight = 5;
            state.properties.paddingBottom = 3;
            state.properties.paddingLeft = 5;

            // Create a separate state for background
            target.setStateOnChildren = true;
            var bgstate = target.background.states.create(stateId);
            bgstate.properties.fill = am4core.color("#fff");
            bgstate.properties.fillOpacity = 0.7;

            return state;
          }
        },
      });
    },
  },
  watch: {
    data() {
      this.draw();
    },
  },
  mounted() {
    this.draw();
  },
})
export default class Budgethistory extends Vue {}
</script>
