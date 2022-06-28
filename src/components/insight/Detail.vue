<template>
  <Panel>
    <Empty v-if="!insight" />
  </Panel>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Panel from "@/components/layout/Panel.vue";
import Empty from "@/components/common/Empty.vue";

@Options({
  components: {
    Empty,
    Panel,
  },
  props: {
    insight: Object,
  },
})
export default class Detail extends Vue {}
</script>

<style src="@vueform/multiselect/themes/default.css"></style>
