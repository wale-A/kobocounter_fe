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
      <Field
        label="Total Budget Amount"
        :value="total.toLocaleString()"
        orientation="row"
      />
      <Field
        label="Start Date"
        :value="format(budget.startDate)"
        orientation="row"
      />
      <Field
        label="End Date"
        :value="format(budget.endDate)"
        orientation="row"
      />
      <p v-if="budget.reuse">
        This budget will be re-used for the same number of days after it expires
      </p>
    </div>
    <div
      v-if="budget.items && budget.items.length > 0"
      class="review__category"
    >
      <h3 class="review__category-title">Budget Categories</h3>
      <hr class="review__category-line" />
      <div class="review__category-wrapper">
        <Field
          v-for="item in budget.items"
          :key="item.category"
          :label="getCategoryName(item.category)"
          :value="item.value.toLocaleString()"
          orientation="row"
        />
      </div>
    </div>
    <div class="review__actions">
      <input
        type="button"
        :value="editing ? 'Update Budget' : 'Activate Budget'"
        :disabled="!budget"
        class="button button--primary"
        @click.stop="$emit('save', budget)"
      />
      <input
        type="button"
        class="button button--secondary"
        value="Edit Budget"
        @click.stop="$emit('edit', budget)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { LabelValueType } from "@/types";
import { getItemNameFromList } from "@/util";
import { isDate } from "date-fns";
import { Options, Vue } from "vue-class-component";
import Field from "./Field.vue";

@Options({
  components: {
    Field,
  },
  props: {
    budget: {
      type: Object,
      required: true,
    },
    categories: {
      type: Array,
      required: true,
    },
    editing: {
      type: Boolean,
      default: "false",
    },
  },
  computed: {
    total() {
      if (!this.budget) {
        return 0;
      }
      return this.budget.items.reduce(
        (acc: number, category: LabelValueType) => {
          return (acc += category.value);
        },
        0
      );
    },
  },
})
export default class Review extends Vue {
  categories!: Array<LabelValueType>;

  getCategoryName = (id: number) => getItemNameFromList(this.categories, id);

  format(date: Date): string {
    if (!date) {
      return "";
    }
    if (!isDate(date)) {
      date = new Date(date);
    }
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    return ` ${day} ${month}, ${year}`;
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
  @include for-size(tablet-landscape-up) {
    min-width: 500px;
    max-height: 700px;
  }

  @at-root #{&}__header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 16px;
    color: #2a2a2a;
    @include for-size(tablet-landscape-up) {
      align-items: flex-start;
    }
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
  @at-root #{&}__category-wrapper {
    height: 150px;
    overflow: auto;
  }
  @at-root #{&}__category-title {
    font-weight: 700;
    font-size: 12px;
    line-height: 16px;
    color: #364156;
  }
  @at-root #{&}__category-line {
    margin-bottom: 9px;
  }
  @at-root #{&}__actions {
    margin-top: 2em;
    display: flex;
    flex-direction: column;
  }
}
</style>
