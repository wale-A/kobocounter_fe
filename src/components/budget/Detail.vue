<template>
  <Panel>
    <Empty v-if="!budget" message="Select a budget to see more details" />
    <View v-else :budget="budget" :data="data" />
  </Panel>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Panel from "@/components/layout/Panel.vue";
import Empty from "@/components/common/Empty.vue";
import View from "./View.vue";

@Options({
  components: {
    Empty,
    Panel,
    View,
  },
  props: {
    budget: Object,
  },
})
export default class Detail extends Vue {}
</script>

<style src="@vueform/multiselect/themes/default.css"></style>
