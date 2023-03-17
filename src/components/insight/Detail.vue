<template>
  <Panel>
    <template v-if="loading">
      <Loader :iconPath="'/img/assets/svg/loading-icons.svg'" />
    </template>
    <template v-else>
      <Empty v-if="!insight" />
      <View v-else :insight="insight" :data="data" />
    </template>
  </Panel>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Panel from "@/components/layout/Panel.vue";
import Empty from "@/components/common/Empty.vue";
import View from "./View.vue";
import Loader from "@/components/layout/Loader.vue";

@Options({
  components: {
    Empty,
    Panel,
    View,
    Loader,
  },
  props: {
    insight: Object,
    data: Object,
    loading: {
      type: Boolean,
      default: false,
    },
  },
})
export default class Detail extends Vue {
  loading!: boolean;
  insight!: any;
  data!: any;
}
</script>

<style src="@vueform/multiselect/themes/default.css"></style>
