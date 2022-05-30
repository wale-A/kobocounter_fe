<template>
  <div class="pane">
    <Empty v-if="!transaction" />
    <component
      v-else
      :is="components[action]"
      :transaction="transaction"
      :parent="parent"
      :sub="children"
      :establishments="establishments"
      @edit="$emit('edit', transaction.id)"
      @split="$emit('split', transaction.id)"
      @select="$emit('select', $event)"
      @addEstablishment="$emit('addEstablishment', $event)"
      @addActivity="$emit('addActivity', $event)"
      @saveEdit="$emit('saveEdit', $event)"
      @saveSplit="$emit('saveSplit', $event)"
      @cancel="$emit('cancel')"
    />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Empty from "./Empty.vue";
import View from "./View.vue";
import Edit from "./Edit.vue";
import Split from "./Split.vue";

@Options({
  props: {
    action: String,
    transaction: Object,
    parent: Object,
    children: Array,
    establishments: Object,
  },
  components: {
    Empty,
    Edit,
    View,
    Split,
  },
  computed: {
    components() {
      return {
        view: "View",
        split: "Split",
        edit: "Edit",
      };
    },
  },
})
export default class Transaction extends Vue {}
</script>

<style src="@vueform/multiselect/themes/default.css"></style>
<style lang="scss" scoped>
@import "@/styles/mixins.scss";
.pane {
  padding: 30px;
  @include for-size(tablet-landscape-up) {
    background: #ffffff;
    box-shadow: 0px 0px 15px 5px rgb(54 65 86 / 10%);
    border-radius: 5px;
  }
}
</style>
