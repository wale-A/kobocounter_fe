<template>
  <div id="incomeChartDiv" :style="{ height: height, width: width }"></div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";

@Options({
  beforeUpdate() {
    this.draw();
  },
  props: {
    revenue: Array,
    expense: Array,
    click: Function,
    height: String,
    width: String,
    fileName: String,
  },
  methods: {
    draw() {
      const chart = am4core.create("incomeChartDiv", am4charts.XYChart);
      //   chart.scrollbarX = new am4core.Scrollbar();
      chart.cursor = new am4charts.XYCursor();
      chart.hiddenState.properties.opacity = 0;

      const dates = ([
        ...new Set([
          ...(this.revenue || []).map((x: { date: string }) => x.date),
          ...(this.expense || []).map((x: { date: string }) => x.date),
        ]),
      ] as string[])
        .map((x) => new Date(x).getTime())
        .sort();
      chart.data = dates.map((x) => {
        return {
          date: new Date(x),
          revenue: this.revenue?.find(
            (y: { date: string }) => new Date(y.date).getTime() === x
          )?.amount,
          expense: Math.abs(
            this.expense?.find(
              (y: { date: string }) => new Date(y.date).getTime() === x
            )?.amount
          ),
        };
      });

      const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      //   dateAxis.renderer.grid.template.location = 0;
      //   dateAxis.renderer.minGridDistance = 30;

      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      dateAxis.fontFamily = "Poppins";
      valueAxis.fontFamily = "Poppins";

      function createSeries(field: string, title: string, color: string) {
        const series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = field;
        series.dataFields.dateX = "date";
        series.name = title;
        series.tooltipText = "{dateX}: [bold]N {valueY}[/]";
        series.strokeWidth = 2;
        series.smoothing = "monotoneX";
        series.fill = am4core.color(color);
        series.stroke = am4core.color(color);
        series.fontFamily = "Poppins";
        series.tooltip = new am4core.Tooltip();
        series.tooltip.fontFamily = "Poppins";

        const bullet = series.bullets.push(new am4charts.CircleBullet());
        bullet.circle.strokeWidth = 1;
        bullet.fontFamily = "Poppins";

        return series;
      }

      createSeries("revenue", "Income", "#33ff33");
      createSeries("expense", "Expenses", "#ff3333");

      chart.legend = new am4charts.Legend();
      chart.legend.position = "bottom";

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
      chart.fontFamily = "Poppins";
      chart.fontSize = "14px";

      chart.responsive.enabled = true;
      chart.responsive.rules.push({
        relevant: am4core.ResponsiveBreakpoints.widthL,
        state: (target, stateId) => {
          if (target instanceof am4charts.Chart) {
            const state = target.states.create(stateId);
            state.properties.paddingLeft = state.properties.paddingRight = 10;
            return state;
          }

          //   if (target instanceof am4core.Scrollbar) {
          //     const state = target.states.create(stateId);
          //     //   state.properties.marginBottom = -10;
          //     state.properties.disabled = true;
          //     return state;
          //   }

          //   if (target instanceof am4charts.Legend) {
          //     const state = target.states.create(stateId);
          //     state.properties.paddingLeft = state.properties.paddingRight = 10;
          //     state.properties.position = "right";
          //     return state;
          //   }

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
  //   watch: {
  //     revenue() {
  //       this.draw();
  //     },
  //     expense() {
  //       this.draw();
  //     },
  //   },
})
export default class IncomeChart extends Vue {}
</script>
