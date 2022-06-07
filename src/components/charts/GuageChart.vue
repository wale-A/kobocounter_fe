<template>
  <div class="guageChartDiv" :style="{ height: '100%', width: '100%' }"></div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import { BudgetItem, BudgetListItem } from "@/types";

@Options({
  mounted() {
    this.draw();
  },
  props: {
    fileName: String,
    budget: {
      type: Array,
      required: true,
    },
  },
  methods: {
    draw() {
      const totalBudget = this.budget.reduce(
        (acc: number, cur: BudgetListItem) => {
          return acc + cur.value;
        },
        0
      );
      const totalSpent = this.budget.reduce(
        (acc: number, cur: BudgetListItem) => {
          return acc + (cur.amountSpent || 0);
        },
        0
      );

      const chart = am4core.create("guageChartDiv", am4charts.GaugeChart);
      const axis = chart.xAxes.push(
        new am4charts.ValueAxis<am4charts.AxisRendererCircular>()
      );
      axis.min = 0;
      axis.max = totalBudget;
      axis.strictMinMax = true;
      axis.renderer.radius = am4core.percent(90);
      axis.renderer.minGridDistance = 100;
      axis.numberFormatter.numberFormat = "#a";
      chart.innerRadius = -20;

      const gradient = new am4core.LinearGradient();
      gradient.stops.push({ color: am4core.color("green"), value: 100000 });
      gradient.stops.push({ color: am4core.color("yellow") });
      gradient.stops.push({ color: am4core.color("orange") });
      gradient.stops.push({ color: am4core.color("red") });

      axis.renderer.line.stroke = gradient;
      axis.renderer.line.strokeWidth = 10;
      axis.renderer.line.strokeLinecap = "round";
      axis.renderer.line.strokeOpacity = 1;

      // axis.renderer.grid.template.disabled = true;
      const hand = chart.hands.push(new am4charts.ClockHand());
      hand.value = totalSpent > totalBudget ? totalBudget * 1.05 : totalSpent;
    },

    // draw() {
    //   enum BudgetCategory {
    //     Budget = "Budget",
    //     Expenses = "Expenses",
    //     AmountLeft = "Amount Left",
    //   }
    //   const budgetData = this.budget?.length
    //     ? [
    //         {
    //           category: BudgetCategory.Budget,
    //           value: this.budget.reduce(
    //             (a: number, b: BudgetListItem) => a + b.value,
    //             0
    //           ),
    //           fill: "#007CFF",
    //         },
    //         {
    //           category: BudgetCategory.Expenses,
    //           value: this.budget.reduce(
    //             (a: number, b: BudgetListItem) => a + (b.amountSpent || 0),
    //             0
    //           ),
    //           fill: "#00ff00",
    //           fillOpacity: 1,
    //         },
    //       ]
    //     : [];

    //   if (budgetData.length) {
    //     budgetData.push({
    //       category: BudgetCategory.AmountLeft,
    //       value: Math.max(budgetData[0].value - budgetData[1].value, 0),
    //       fill: "#007CFF",
    //       fillOpacity: 0.01,
    //     });
    //     const spendRate = budgetData[1].value / budgetData[0].value;
    //     (
    //       budgetData.find((x) => x.category === BudgetCategory.Expenses) as any
    //     ).fill =
    //       spendRate > 0.74
    //         ? "#FF0000"
    //         : spendRate > 0.4
    //         ? "#ff8000"
    //         : "#00ff00";
    //   }

    //   // Create chart instance
    //   let chart = am4core.create("guageChartDiv", am4charts.PieChart);
    //   // Let's cut a hole in our Pie chart the size of 40% the radius
    //   chart.innerRadius = am4core.percent(40);

    //   // inner pie chart
    //   let innerPieChart = chart.series.push(new am4charts.PieSeries());
    //   innerPieChart.dataFields.value = "value";
    //   innerPieChart.dataFields.category = "category";
    //   innerPieChart.slices.template.propertyFields.fill = "fill";
    //   innerPieChart.labels.template.disabled = true;
    //   innerPieChart.innerRadius = am4core.percent(55);
    //   innerPieChart.radius = am4core.percent(80);
    //   innerPieChart.slices.template.opacity = 1;
    //   innerPieChart.data = budgetData.filter(
    //     (x) => x.category == BudgetCategory.Budget
    //   );

    //   let outerPieChart = chart.series.push(new am4charts.PieSeries());
    //   outerPieChart.dataFields.value = "value";
    //   outerPieChart.dataFields.category = "category";
    //   outerPieChart.innerRadius = am4core.percent(40);
    //   outerPieChart.radius = am4core.percent(100);
    //   innerPieChart.legendSettings.createMarker = false;
    //   outerPieChart.slices.template.propertyFields.fill = "fill";
    //   outerPieChart.slices.template.propertyFields.fillOpacity = "fillOpacity";
    //   outerPieChart.slices.template.strokeOpacity = 0.01;
    //   outerPieChart.labels.template.disabled = true;
    //   outerPieChart.data = budgetData.filter(
    //     (x) => x.category != BudgetCategory.Budget
    //   );

    //   // Disable sliding out of slices
    //   const activeKeyOuterSeries =
    //     outerPieChart.slices.template.states.getKey("active");
    //   if (activeKeyOuterSeries) activeKeyOuterSeries.properties.shiftRadius = 0;

    //   const hoverKeyOuterSeries =
    //     outerPieChart.slices.template.states.getKey("hover");
    //   if (hoverKeyOuterSeries) hoverKeyOuterSeries.properties.scale = 1;

    //   const activeKeyInnerSeries =
    //     innerPieChart.slices.template.states.getKey("active");
    //   if (activeKeyInnerSeries) activeKeyInnerSeries.properties.shiftRadius = 0;

    //   const hoverKeyInnerSeries =
    //     innerPieChart.slices.template.states.getKey("hover");
    //   if (hoverKeyInnerSeries) hoverKeyInnerSeries.properties.scale = 1;

    //   /* Add legend */
    //   const legend = new am4charts.Legend();
    //   legend.data = budgetData
    //     .filter((x) => x.category != BudgetCategory.Budget)
    //     .map((x) => ({
    //       name: `${x.category}: ${x.value.toLocaleString()}`,
    //       fill: x.fill,
    //     }));
    //   legend.fontSize = "0.8rem";
    //   legend.itemContainers.template.clickable = false;
    //   legend.itemContainers.template.focusable = false;
    //   legend.parent = chart.chartContainer;
    //   legend.position = "bottom";
    // },
  },
  watch: {
    budget() {
      this.draw();
    },
  },
})
export default class GuageChart extends Vue {}
</script>
