<!--
This component helps draw a donut chart (piechart with a hole at the center)
https://www.amcharts.com/docs/v4/chart-types/treemap/

i left a bit more comment  on some of the code blocks in the new-ui branch.
they will be brought in here on merge.
-->

<template>
  <div class="donutChartDiv" :style="{ height: '100%', width: '100%' }"></div>
</template>

<script lang="ts">
import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4core from "@amcharts/amcharts4/core";
import { Options, Vue } from "vue-class-component";

@Options({
  props: {
    inputData: {
      type: Object,
    },
    height: String,
    width: String,
    fileName: String,
    clickHandler: Function,
    categories: Array,
  },

  methods: {},
  mounted() {
    const data = this.inputData?.map((x: any) => {
      return { category: x.displayCategory, amount: x.amount };
    });
    if (data.length) this.draw(data, this.categories, this.clickHandler);
    else this.drawPlaceholder();
  },
})
export default class DonutChart extends Vue {
  categories!: { value: string; label: string }[];
  clickHandler!: (e?: any) => void;

  drawPlaceholder() {
    const chart = am4core.create("donutChartDiv", am4charts.PieChart);
    chart.data = [
      {
        country: "Dummy",
        disabled: true,
        value: 1000,
        color: am4core.color("#dadada"),
        opacity: 0.3,
        strokeDasharray: "4,4",
        tooltip: "",
      },
    ];
    /* Create series */
    const series = chart.series.push(new am4charts.PieSeries());
    series.dataFields.value = "value";
    series.dataFields.category = "country";

    /* Set up slice appearance */
    const slice = series.slices.template;
    slice.propertyFields.fill = "color";
    slice.propertyFields.fillOpacity = "opacity";
    slice.propertyFields.stroke = "color";
    slice.propertyFields.strokeDasharray = "strokeDasharray";
    slice.propertyFields.tooltipText = "tooltip";

    series.labels.template.propertyFields.disabled = "disabled";
    series.ticks.template.propertyFields.disabled = "disabled";
  }

  draw(
    chartData: [] | null,
    categories: Record<string, any>,
    clickHandler?: (e?: any) => void
  ) {
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

    /*
     * uncomment code if you want to add the export menu
     * to allow users save the chart
     */
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
    series.fontSize = "1em";
    series.labels.template.disabled = false;
    series.labels.template.fontSize = "1em";
    series.labels.template.wrap = true;
    series.ticks.template.disabled = false;
    series.legendSettings.itemValueText = "[bold]N {amount}[/]";
    series.slices.template.fillOpacity = 1;

    series.slices.template.events.on("hit", function (ev) {
      const categoryValue = categories.find(
        (x: { value: number; label: string }) =>
          x.label == (ev.target?.dataItem?.dataContext as any)?.category
      )?.value;
      if (!isNaN(categoryValue) && clickHandler) {
        clickHandler({
          category: [categoryValue],
        });
      }
    });

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
          target.labels.template.states.create(stateId).properties.disabled =
            true;
          target.ticks.template.states.create(stateId).properties.disabled =
            true;
          return state;
        }
        if (target instanceof am4charts.PieChart3D) {
          const state = target.states.create(stateId);
          const legendProperties =
            target.legend.states.create(stateId).properties;
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
          const legendProperties =
            target.legend.states.create(stateId).properties;
          legendProperties.position = "bottom";
          return state;
        }
        if (target instanceof am4charts.PieSeries3D) {
          const state = target.states.create(stateId);
          const labelProperties =
            target.labels.template.states.create(stateId).properties;
          labelProperties.marginLeft =
            labelProperties.marginRight =
            labelProperties.paddingLeft =
            labelProperties.paddingRight =
              0;
          labelProperties.fontSize = 13;
          labelProperties.maxWidth = 150;
          const tickProperties =
            target.ticks.template.states.create(stateId).properties;
          tickProperties.maxWidth = 5;
          return state;
        }
      },
    });
  }
}
</script>

<style scoped>
.donutChartDiv {
  cursor: pointer;
}
</style>
