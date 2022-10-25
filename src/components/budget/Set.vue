<template>
  <Overlay class="spacer">
    <component
      :is="components[action]"
      :categories="categories"
      :budget="budget"
      @review="$emit('review', $event)"
      @save="$emit('save', $eventd)"
      @cancel="$emit('cancel')"
    />
  </Overlay>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Overlay from "@/components/common/Overlay.vue";
import Add from "./_internal/Add.vue";
import Review from "./_internal/Review.vue";

@Options({
  components: {
    Overlay,
    Add,
    Review,
  },
  props: {
    action: {
      type: String,
      default: "add",
    },
    categories: {
      type: Array,
      required: true,
    },
    budget: {
      type: Object,
      default: null,
    },
  },
  computed: {
    components() {
      return {
        add: "Add",
        Review: "Review",
      };
    },
  },
})
export default class Set extends Vue {}
</script>

<style src="@vueform/multiselect/themes/default.css"></style>

<style lang="scss" scoped>
.spacer {
  padding: 30px;
}
</style>
