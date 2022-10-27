<template>
  <div class="review">
    <div class="review__header">
      <h2 class="review__title">
        <button class="review__nav" @click="$router.push({ path: '/Budgets' })">
          <svg-icon
            :src="require('@/assets/svg/back.svg')"
            class="filter__trigger-icon"
          />
        </button>
        <span>Review your budget</span>
      </h2>
      <p class="review__subtitle">Budget cannot be edited once activated</p>
    </div>
    <div class="review__detail">
      <Field label="Total Budget Amount" :value="total" orientation="row" />
      <Field label="Start Date" :value="budget.startDate" orientation="row" />
      <Field label="End Date" :value="budget.endDate" orientation="row" />
      <p v-if="budget.reuse">
        This budget will be re-used for the same number of days after it expires
      </p>
    </div>
    <div
      v-if="budget.items && budget.items.length > 0"
      class="review__category"
    >
      <h3 class="review__category-title">Budget Categories</h3>
      <Field
        v-for="item in budget.items"
        :key="item.category"
        :label="getCategoryName(item.category)"
        :value="item.value"
        orientation="row"
      />
    </div>
    <div class="review__actions">
      <input
        type="button"
        value="Activate Budget"
        :disabled="!budget"
        class="button button--primary"
        @click.stop="$emit('save', budget)"
      />
      <input
        type="button"
        class="button button--secondary"
        value="Edit Budget"
        @click.stop="$emit('cancel')"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Field from "./Field.vue";

type categoryType = { value: number; label: string };
@Options({
  components: {
    Field,
  },
  props: {
    budget: Object,
    categories: {
      type: Array,
      required: true,
    },
  },
  computed: {
    total() {
      if (!this.budget) {
        return 0;
      }
      return this.budget.items.reduce((acc: number, category: categoryType) => {
        return (acc += category.value);
      }, 0);
    },
  },
})
export default class Review extends Vue {
  categories!: Array<categoryType>;

  getCategoryName(id: number): string {
    return this.categories.find((item) => item.value == id)?.label || "";
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/mixins.scss";
.review {
  background: #ffffff;
  box-shadow: 0px 2px 5px rgba(54, 65, 86, 0.05);
  border-radius: 5px;
  padding: 20px 30px 30px;
  max-width: 500px;

  @at-root #{&}__header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 16px;
    color: #2a2a2a;
  }
  @at-root #{&}__nav {
    background: transparent;
    border: none;
    text-align: left;
    margin-right: 10px;
    @include for-size(tablet-landscape-up) {
      margin-right: unset;
      display: none;
    }
  }
  @at-root #{&}__title {
    font-weight: 700;
    font-size: 18px;
    line-height: 25px;
    margin-bottom: 3px;
    color: #2a2a2a;
  }
  @at-root #{&}__subtitle {
    font-size: 14px;
    line-height: 19px;
  }
  @at-root #{&}__detail {
    margin-bottom: 28px;
  }
  @at-root #{&}__category-title {
    font-weight: 700;
    font-size: 12px;
    line-height: 16px;

    color: #364156;
    margin-bottom: 9px;
  }
}
</style>
