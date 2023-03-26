<template>
  <div
    class="budgetItemChartDiv"
    :style="{
      height: '36vh',
      width: '100%',
      marginTop: '1.2em',
    }"
  ></div>
</template>

<script lang="ts">
import { BudgetItem, LabelValueType } from "@/types";
import { getItemNameFromList } from "@/util";
import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4core from "@amcharts/amcharts4/core";
import { Options, Vue } from "vue-class-component";

@Options({
  props: {
    items: Array,
    categories: Array,
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
export default class BudgetItemChart extends Vue {
  items!: BudgetItem[];
  categories!: Array<LabelValueType>;
  getCategoryName = (id: number) => getItemNameFromList(this.categories, id);
  draw() {
    const chart = am4core.create("budgetItemChartDiv", am4charts.XYChart);
    chart.responsive.enabled = true;
    chart.cursor = new am4charts.XYCursor();
    chart.hiddenState.properties.opacity = 0;
    chart.data = this.items.map((item) => ({
      expense: item.amountSpent || 0,
      budget: item.value,
      category: this.getCategoryName(Number(item.category)),
    }));

    console.log({ data: chart.data });

    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = "category";
    categoryAxis.renderer.minGridDistance = 40;
    categoryAxis.fontSize = "0.8em";

    // truncate the labels
    const label = categoryAxis.renderer.labels.template;
    label.truncate = true;
    label.maxWidth = 15;

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    // display the lines for the horizontal axis and not the vertical axis
    categoryAxis.renderer.grid.template.disabled = true;
    valueAxis.renderer.grid.template.disabled = false;
    // hides the X and Y axis lines, set value to 1 to show axis
    categoryAxis.renderer.line.strokeOpacity = 0;
    valueAxis.renderer.line.strokeOpacity = 0;

    categoryAxis.fontFamily = "Poppins";
    valueAxis.fontFamily = "Poppins";

    function createSeries(field: string, title: string, color: string) {
      const series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = field;
      series.dataFields.categoryX = "category";
      series.name = title;
      series.tooltipText = "{categoryX}: [bold]N {valueY}[/]";
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
  }
}
</script>
