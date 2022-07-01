<template>
  <Panel>
    <Empty v-if="!insight" />
    <View v-else :insight="insight" :data="data" />
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
    insight: Object,
    data: Array,
  },
})
export default class Detail extends Vue {}
</script>

<style src="@vueform/multiselect/themes/default.css"></style>
