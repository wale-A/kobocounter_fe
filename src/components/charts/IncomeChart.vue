<template>
  <div class="incomeChartDiv" :style="{ height: height, width: width }"></div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";

@Options({
  props: {
    revenue: Array,
    expense: Array,
    netIncome: Array,
    click: Function,
    height: String,
    width: String,
    fileName: String,
  },
  methods: {
    draw() {
      const chart = am4core.create("incomeChartDiv", am4charts.XYChart);
      chart.cursor = new am4charts.XYCursor();
      chart.hiddenState.properties.opacity = 0;
      const dates = ([
        ...new Set([
          ...(this.revenue || []).map((x: { date: string }) =>
            x.date.replace(/-/g, "/")
          ),
          ...(this.expense || []).map((x: { date: string }) =>
            x.date.replace(/-/g, "/")
          ),
          ...(this.netIncome || []).map((x: { date: string }) =>
            x.date.replace(/-/g, "/")
          ),
        ]),
      ] as string[])
        .map((x) => new Date(x).getTime())
        .sort();
      const months =
        (dates[dates.length - 1] - dates[0]) / (1000 * 60 * 60 * 24 * 30);

      chart.data = dates.map((x) => {
        const expense = this.expense?.find(
          (y: { date: string }) =>
            new Date(y.date.replace(/-/g, "/")).getTime() === x
        )?.amount;
        return {
          date: x,
          revenue: this.revenue?.find(
            (y: { date: string }) =>
              new Date(y.date.replace(/-/g, "/")).getTime() === x
          )?.amount,
          expense: expense ? Math.abs(expense) : undefined,
          netIncome: this.netIncome?.find(
            (y: { date: string }) =>
              new Date(y.date.replace(/-/g, "/")).getTime() === x
          )?.amount,
        };
      });

      const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      //   dateAxis.renderer.grid.template.location = 0;
      //   dateAxis.renderer.minGridDistance = 30;

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
        const series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = field;
        series.dataFields.dateX = "date";
        series.name = title;
        series.tooltipText = "{dateX}: [bold]N {valueY}[/]";
        // width of the line chart, increase value to increase thickness of the line
        series.strokeWidth = 2;
        series.smoothing = "monotoneX";
        series.fill = am4core.color(color);
        series.stroke = am4core.color(color);
        series.fontFamily = "Poppins";
        series.tooltip = new am4core.Tooltip();
        series.tooltip.fontFamily = "Poppins";

        // hides the bullets showing each point of the line, uncomment code below to show the points
        // const bullet = series.bullets.push(new am4charts.CircleBullet());
        // bullet.circle.strokeWidth = 1;
        // bullet.fontFamily = "Poppins";

        return series;
      }

      if (this.revenue) {
        createSeries("revenue", "Income", "#33ff33");
      }
      if (this.expense) {
        createSeries("expense", "Expense", "#ff3333");
      }
      if (this.netIncome) {
        createSeries("netIncome", "Net Income", "#007cff");
      }

      chart.legend = new am4charts.Legend();
      chart.legend.position = "bottom";
      chart.scrollbarX = new am4core.Scrollbar();
      chart.scrollbarX.properties.disabled = true;

      // do not allow scrollbar, do not export chart
      // if (months > 3) {
      //   chart.scrollbarX.properties.disabled = false;
      // } else {
      //   chart.exporting.menu = new am4core.ExportMenu();
      //   chart.exporting.menu.items = [
      //     {
      //       label: "...",
      //       menu: [
      //         { type: "png", label: "PNG" },
      //         { type: "print", label: "PDF" },
      //       ],
      //     },
      //   ];
      // }

      chart.fontFamily = "Poppins";
      chart.fontSize = "14";

      // this adds a scrollbar to the which might be useful for small screens
      // chart.responsive.enabled = true;

      chart.responsive.rules.push({
        relevant: am4core.ResponsiveBreakpoints.widthL,
        state: (target, stateId) => {
          // if (target instanceof am4charts.Chart) {
          //   const state = target.states.create(stateId);
          //   chart.scrollbarX = new am4core.Scrollbar();
          //   state.properties.paddingLeft = state.properties.paddingRight = 10;
          //   state.properties.paddingTop = 50;
          //   return state;
          // }

          // if (target instanceof am4core.Scrollbar) {
          //   const state = target.states.create(stateId);
          //   // target.marginTop = 35;
          //   state.properties.marginTop = 0;
          //   state.properties.disabled = false;
          //   // state.properties.zIndex = 10;
          //   return state;
          // }

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
  watch: {
    revenue() {
      this.draw();
    },
    expense() {
      this.draw();
    },
    netIncome() {
      this.draw();
    },
  },
})
export default class IncomeChart extends Vue {}
</script>
