<template>
  <div class="guageChartDiv" :style="{ height: '90%', width: '100%' }"></div>
  <p style="text-align: center; font-size: smaller; margin-top: 1px">
    N{{ totalSpent?.toLocaleString() }} spent out of a budget of N{{
      totalBudget?.toLocaleString()
    }}
  </p>
</template>

<script lang="ts">
import { BudgetListItem } from "@/types";
import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4core from "@amcharts/amcharts4/core";
import { Options, Vue } from "vue-class-component";

@Options({
  mounted() {
    this.draw(this.clickHandler);
  },
  props: {
    fileName: String,
    budget: {
      type: Array,
      required: true,
    },
    clickHandler: Function,
  },
})
export default class GuageChart extends Vue {
  budget!: BudgetListItem[];
  clickHandler!: (e?: any) => void;

  draw(clickHandler: () => void) {
    const chart = am4core.create("guageChartDiv", am4charts.GaugeChart);
    chart.events.on("hit", function (ev) {
      clickHandler();
    });

    const axis = chart.xAxes.push(
      new am4charts.ValueAxis<am4charts.AxisRendererCircular>()
    );
    axis.min = 0;
    axis.max = this.totalBudget;
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
    hand.value =
      this.totalSpent > this.totalBudget
        ? this.totalBudget * 1.05
        : this.totalSpent;
  }

  mounted() {
    this.draw(this.clickHandler);
  }

  totalBudget = this.budget?.reduce((acc: number, cur: BudgetListItem) => {
    return acc + Number(cur.value);
  }, 0);
  totalSpent = this.budget?.reduce((acc: number, cur: BudgetListItem) => {
    return acc + Number(cur.amountSpent || 0);
  }, 0);
}
</script>

<style scoped>
.guageChartDiv {
  cursor: pointer;
}
</style>
