<template>
  <div class="incomeChartDiv" :style="{ height: '100%', width: '100%' }"></div>
</template>

<script lang="ts">
import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4core from "@amcharts/amcharts4/core";
import { Options, Vue } from "vue-class-component";

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
  mounted() {
    this.draw();
  },
  methods: {
    draw() {
      const chart = am4core.create("incomeChartDiv", am4charts.XYChart);
      chart.responsive.enabled = true;
      chart.cursor = new am4charts.XYCursor();
      chart.hiddenState.properties.opacity = 0;
      const dates = (
        [
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
        ] as string[]
      )
        .map((x) => new Date(x).getTime())
        .sort();
      // const months =
      //   (dates[dates.length - 1] - dates[0]) / (1000 * 60 * 60 * 24 * 30);

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
          expense: Math.abs(expense) || undefined,
          netIncome: this.netIncome?.find(
            (y: { date: string }) =>
              new Date(y.date.replace(/-/g, "/")).getTime() === x
          )?.amount,
        };
      });

      const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.grid.template.location = 0;
      dateAxis.renderer.minGridDistance = 40;
      dateAxis.fontSize = "0.8em";

      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      // display the lines for the horizontal axis and not the vertical axis
      dateAxis.renderer.grid.template.disabled = true;
      valueAxis.renderer.grid.template.disabled = false;
      // hides the X and Y axis lines, set value to 1 to show axis
      dateAxis.renderer.line.strokeOpacity = 0;
      valueAxis.renderer.line.strokeOpacity = 0;

      dateAxis.fontFamily = "Poppins";
      valueAxis.fontFamily = "Poppins";

      function createSeries(
        field: string,
        title: string,
        color: string,
        eventHandler?: (e: unknown) => void
      ) {
        /**
         * this code is for the line graph, before i made the change to a bar chart
        // const series = chart.series.push(new am4charts.LineSeries());
        // series.dataFields.valueY = field;
        // series.dataFields.dateX = "date";
        // series.name = title;
        // series.tooltipText = "{dateX}: [bold]N {valueY}[/]";
        // // width of the line chart, increase value to increase thickness of the line
        // series.strokeWidth = 2;
        // series.smoothing = "monotoneX";
        // series.fill = am4core.color(color);
        // series.stroke = am4core.color(color);
        // series.fontFamily = "Poppins";
        // series.tooltip = new am4core.Tooltip();
        // series.tooltip.fontFamily = "Poppins";

        // // hides the bullets showing each point of the line, uncomment code below to show the points
        // // const bullet = series.bullets.push(new am4charts.CircleBullet());
        // // bullet.circle.strokeWidth = 1;
        // // bullet.fontFamily = "Poppins";
        */

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
        // series.tooltip.ignoreBounds = true;
        // series.stacked = true;

        // if (eventHandler)
        series.columns.template.events.on("hit", function (ev) {
          console.log({ ev });
          console.log({ data: ev.target?.dataItem?.dataContext });
        });

        return series;
      }

      if (this.revenue) {
        // const revenueSeries = createSeries("revenue", "Income", "#33ff33");
        const revenueSeries = createSeries("revenue", "Income", "#26a023");
        // revenueSeries.columns.template.tooltipX = am4core.percent(100);
        // revenueSeries.columns.template.tooltipY = am4core.percent(0);
        revenueSeries.tooltip!.pointerOrientation = "down";
      }
      if (this.expense) {
        // const expenseSeries = createSeries("expense", "Expense", "#ff3333");
        const expenseSeries = createSeries("expense", "Expense", "#fa1d1d");
        // expenseSeries.columns.template.tooltipX = am4core.percent(0);
        // expenseSeries.columns.template.tooltipY = am4core.percent(100);
        expenseSeries.tooltip!.pointerOrientation = "up";
      }
      if (this.netIncome) {
        const series = createSeries("netIncome", "Income Minus Expenses", "");
        // draw negative sections of the line in red
        const negativeRange = valueAxis.createSeriesRange(series);
        negativeRange.value = Math.min(
          ...this.netIncome.map((x: { amount: number }) => x.amount)
        );
        negativeRange.endValue = 0;
        negativeRange.contents.stroke = am4core.color("#ff3333");
        negativeRange.contents.fill = negativeRange.contents.stroke;
        // negativeRange.contents.tooltip!.getFillFromObject = false;
        // negativeRange.contents.tooltip!.fill = am4core.color("#ff3333");

        const positiveRange = valueAxis.createSeriesRange(series);
        positiveRange.endValue = Math.max(
          ...this.netIncome.map((x: { amount: number }) => x.amount)
        );
        positiveRange.value = 0;
        positiveRange.contents.stroke = am4core.color("#33ff33");
        positiveRange.contents.fill = positiveRange.contents.stroke;
        // negativeRange.contents.tooltip!.getFillFromObject = false;
        // negativeRange.contents.tooltip!.fill = am4core.color("#33ff33");
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
  // watch: {
  //   revenue(val, oldVal) {
  //     if (
  //       oldVal &&
  //       val &&
  //       val.filter((x: unknown) => oldVal.includes(x)).length
  //     ) {
  //       console.log(
  //         "filtered revenue: ",
  //         val.filter((x: unknown) => oldVal.includes(x))
  //       );
  //       console.log("revenue....", { val, oldVal });
  //       this.draw();
  //     }
  //   },
  //   expense(val, oldVal) {
  //     if (
  //       oldVal &&
  //       val &&
  //       val.filter((x: unknown) => oldVal.includes(x)).length
  //     ) {
  //       console.log("expense.....", { val, oldVal });
  //       this.draw();
  //     }
  //   },
  //   netIncome(val) {
  //     console.log({ netIncome: val });
  //     this.draw();
  //   },
  // },
})
export default class IncomeChart extends Vue {}
</script>
