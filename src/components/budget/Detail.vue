<template>
  <Panel>
    <template v-if="loading">
      <Loader :iconPath="'/img/assets/svg/loading-icons.svg'" />
    </template>
    <template v-else>
      <Empty v-if="!budget" message="Select a budget to see more details" />
      <View v-else :budget="budget" :categories="categories" />
    </template>
  </Panel>
</template>

<script lang="ts">
import Empty from "@/components/common/Empty.vue";
import Loader from "@/components/layout/Loader.vue";
import Panel from "@/components/layout/Panel.vue";
import { LabelValueType } from "@/types";
import { Options, Vue } from "vue-class-component";
import View from "./View.vue";

@Options({
  components: {
    Empty,
    Panel,
    View,
    Loader,
  },
  props: {
    budget: Object,
    loading: {
      type: Boolean,
      default: false,
    },
    categories: {
      type: Array,
      required: true,
    },
  },
})
export default class Detail extends Vue {
  loading!: boolean;
  budget!: any;
  categories!: Array<LabelValueType>;
}
</script>

<style src="@vueform/multiselect/themes/default.css"></style>
