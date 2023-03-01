<template>
  <Overlay class="spacer">
    <component
      :is="components[action]"
      :categories="categories"
      :budget="budget"
      @review="$emit('review', $event)"
      @edit="$emit('edit', $event)"
      @save="$emit('save', $event)"
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
    loading: {
      type: Boolean,
      default: "false",
    },
  },
  computed: {
    components() {
      return {
        add: "Add",
        review: "Review",
      };
    },
  },
})
export default class Create extends Vue {
  components!: Record<string, string>;
  action!: string;
  categories!: Array<any>;
  budget!: any;

  created(): void {
    console.log(this.action, this.categories, this.budget);
  }
}
</script>

<style src="@vueform/multiselect/themes/default.css"></style>

<style lang="scss" scoped>
.spacer {
  padding: 30px;
}
</style>
