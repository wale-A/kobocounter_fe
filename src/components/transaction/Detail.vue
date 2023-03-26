<template>
  <Panel class="spacer">
    <component
      :is="components[key]"
      :transaction="transaction"
      :parent="parent"
      :sub="children"
      :establishments="establishments"
      :allExpenseCategories="allExpenseCategories"
      :allTransactionCategories="allTransactionCategories"
      :loading="loading"
      :saving="saving"
      @edit="$emit('edit', transaction.id)"
      @split="$emit('split', transaction.id)"
      @select="$emit('select', $event)"
      @addEstablishment="$emit('addEstablishment', $event)"
      @addActivity="$emit('addActivity', $event)"
      @saveEdit="$emit('saveEdit', $event)"
      @saveSplit="$emit('saveSplit', $event)"
      @cancel="$emit('cancel')"
    />
  </Panel>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Empty from "@/components/common/Empty.vue";
import View from "./View.vue";
import Edit from "./Edit.vue";
import Split from "./Split.vue";
import Panel from "@/components/layout/Panel.vue";
import Loader from "@/components/layout/Loader.vue";

@Options({
  props: {
    action: String,
    transaction: Object,
    parent: Object,
    children: Array,
    establishments: Object,
    allExpenseCategories: {
      type: Array,
      required: true,
    },
    allTransactionCategories: {
      type: Array,
      required: true,
    },
    saving: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    Empty,
    Edit,
    View,
    Split,
    Panel,
    Loader,
  },
  computed: {
    key() {
      if (this.loading) {
        return "loader";
      }
      return this.transaction ? this.action : "empty";
    },
    components() {
      return {
        view: "View",
        split: "Split",
        edit: "Edit",
        empty: "Empty",
        loader: "Loader",
      };
    },
  },
})
export default class Transaction extends Vue {}
</script>

<style src="@vueform/multiselect/themes/default.css"></style>

<style lang="scss" scoped>
.spacer {
  padding: 30px;
}
</style>
