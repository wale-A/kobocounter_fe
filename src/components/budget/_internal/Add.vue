<template>
  <div class="budget">
    <div class="budget__header">
      <h1 class="budget__title">
        <button class="budget__nav" @click="$router.go(-1)">
          <svg-icon
            :src="require('@/assets/svg/back.svg')"
            class="budget__nav-icon"
          />
        </button>
        <span class="budget__title-text">Create a new budget</span>
      </h1>
    </div>
    <div class="budget__form">
      <div class="budget__section">
        <p class="budget__section-description">Choose a date for your budget</p>
        <div class="budget__field-group">
          <div class="budget__field-group-item">
            <div class="budget__field-control">
              <label class="budget__field-label">From</label>
              <Datepicker
                v-model="model.startDate"
                :start-date="startDate"
                :allowed-dates="allowedDates"
                :format="format"
                :auto-position="false"
                auto-apply
                hide-input-icon
                class="budget__field-input"
              />
            </div>
          </div>
          <div class="budget__field-group-item">
            <div class="budget__field-control">
              <label class="budget__field-label">To</label>
              <input
                :value="format(model.endDate)"
                type="text"
                class="budget__field-input"
                readonly
              />
            </div>
          </div>
        </div>
      </div>
      <div class="budget__section budget__section--alt">
        <p class="budget__section-description">Select budget categories</p>
        <div class="budget__section-group budget__section-group--auto">
          <table class="budget__list">
            <thead>
              <tr class="budget__list-row">
                <td class="budget__list-row-item budget__list-row-item--header">
                  Category
                </td>
                <td class="budget__list-row-item budget__list-row-item--header">
                  Amount
                </td>
                <td
                  class="budget__list-row-item budget__list-row-item--header"
                ></td>
              </tr>
            </thead>
            <tbody>
              <template v-if="model.items.length">
                <tr
                  v-for="item in model.items"
                  :key="item.category"
                  class="budget__list-row"
                >
                  <td class="budget__list-row-item">
                    {{ categoryMap[item.category] || item.category }}
                  </td>
                  <td class="budget__list-row-item">
                    {{ item.value?.toLocaleString() }}
                  </td>
                  <td class="budget__list-row-item">
                    <button
                      class="budget__list-row-item-action"
                      @click.prevent="remove(item.category)"
                    >
                      <svg-icon :src="require('@/assets/svg/del.svg')" />
                    </button>
                  </td>
                </tr>
              </template>
              <template v-else>
                <tr>
                  <td colspan="3" class="budget__list-row-empty">No data</td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
      <div class="budget__section">
        <div class="budget__field-group">
          <div class="budget__field-group-item budget__field-group-item--add">
            <div class="budget__field-control">
              <label class="budget__field-label">Choose category</label>
              <Multiselect
                v-model="category"
                :searchable="true"
                :options="availableCategories"
                noResultsText="No result found"
                class="budget__field-input"
              />
            </div>
          </div>
          <div class="budget__field-group-item budget__field-group-item--add">
            <div class="budget__field-control">
              <label class="budget__field-label">Enter Amount</label>
              <input
                v-model="value"
                type="number"
                class="budget__field-input"
                min="0"
              />
            </div>
          </div>
          <div class="budget__field-group-item budget__field-group-item--add">
            <div class="budget__field-control">
              <button
                :disabled="!canAdd"
                class="budget__field-action"
                @click.stop="add"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="budget__actions">
        <input
          type="button"
          value="Review Budget"
          :disabled="!canSubmit || loadingOperation"
          class="button button--primary"
          :class="{ 'button--disabled': !canSubmit }"
          @click.stop="$emit('review', model)"
        />
        <input
          type="button"
          class="button button--secondary"
          value="Cancel"
          @click.stop="$emit('cancel')"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { BUDGET_TYPE_OPTIONS } from "@/config";
import { Transaction } from "@/types";
import Multiselect from "@vueform/multiselect";
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import {
  addMonths,
  addWeeks,
  endOfMonth,
  endOfWeek,
  isDate,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { Options, Vue } from "vue-class-component";

type categoryType = { value: number; label: string };
type modelType = {
  startDate: string;
  endDate: string;
  items: {
    category: string;
    value: null | number;
  }[];
};
@Options({
  components: { Multiselect, Datepicker },
  props: {
    categories: {
      type: Array,
      required: true,
    },
    budget: {
      type: Object,
      required: true,
    },
    lastBudget: {
      type: Object,
      default: null,
    },
    budgetType: {
      type: String,
      default: "monthly",
    },
    editing: {
      type: Boolean,
      default: "false",
    },
  },
  computed: {
    activeCategories() {
      return this.model.items.map(
        (item: { value: number; category: string }) => item.category
      );
    },
    availableCategories() {
      return this.categories.map((category: categoryType) => ({
        ...category,
        disabled: this.activeCategories.includes(category.value),
      }));
    },
    categoryMap() {
      return this.categories.reduce(
        (acc: Record<string, string>, { value, label }: categoryType) => ({
          ...acc,
          [value]: label,
        }),
        {}
      );
    },
    canAdd() {
      return this.value && this.category;
    },
    canSubmit() {
      // TODO: check is model is diff if editing and ensure dates can't be changed
      return (
        this.model.startDate &&
        this.model.items &&
        this.model.items.every(
          (x: { category: string; value: number }) => x.category && x.value
        )
      );
    },
    prevEndDate() {
      if (!this.lastBudget?.endDate) {
        return null;
      }
      const [withoutTime] = this.lastBudget.endDate.split("T");
      return new Date(withoutTime);
    },
    allowedDates() {
      const now = new Date();
      switch (this.budgetType) {
        case BUDGET_TYPE_OPTIONS.WEEKLY: {
          const next = this.prevEndDate ? addWeeks(this.prevEndDate, 1) : now;
          return [startOfWeek(next), endOfWeek(next)];
        }
        case BUDGET_TYPE_OPTIONS.BI_WEEKLY: {
          const start = this.prevEndDate ? addWeeks(this.prevEndDate, 1) : now;
          const end = addWeeks(this.prevEndDate || now, 2);
          return [startOfWeek(start), endOfWeek(end)];
        }
        case BUDGET_TYPE_OPTIONS.BI_MONTHLY: {
          const start = this.prevEndDate ? addMonths(this.prevEndDate, 1) : now;
          const end = addMonths(this.prevEndDate || now, 2);
          return [startOfMonth(start), endOfMonth(end)];
        }
        case BUDGET_TYPE_OPTIONS.QUATERLY: {
          const start = this.prevEndDate ? addMonths(this.prevEndDate, 1) : now;
          const end = addMonths(this.lprevEndDate || now, 3);
          return [startOfMonth(start), endOfMonth(end)];
        }
        case BUDGET_TYPE_OPTIONS.MID_YEAR: {
          const start = this.prevEndDate ? addMonths(this.prevEndDate, 1) : now;
          const end = addMonths(this.prevEndDate || now, 6);
          return [startOfMonth(start), endOfMonth(end)];
        }
        case BUDGET_TYPE_OPTIONS.YEARLY: {
          const start = this.prevEndDate ? addMonths(this.prevEndDate, 1) : now;
          const end = addMonths(this.prevEndDate || now, 12);
          return [startOfMonth(start), endOfMonth(end)];
        }
        default: {
          const next = this.prevEndDate ? addMonths(this.prevEndDate, 1) : now;
          return [startOfMonth(next), endOfMonth(next)];
        }
      }
    },
    startDate() {
      return this.allowedDates[0];
    },
  },
  watch: {
    "model.startDate"(val) {
      if (val) {
        const newDate = new Date(val);
        switch (this.budgetType) {
          case BUDGET_TYPE_OPTIONS.WEEKLY: {
            this.model.endDate = endOfWeek(newDate);
            break;
          }
          case BUDGET_TYPE_OPTIONS.BI_WEEKLY: {
            const end = addWeeks(newDate, 2);
            this.model.endDate = endOfWeek(end);
            break;
          }
          case BUDGET_TYPE_OPTIONS.BI_MONTHLY: {
            const end = addMonths(newDate, 2);
            this.model.endDate = endOfMonth(end);
            break;
          }
          case BUDGET_TYPE_OPTIONS.QUATERLY: {
            const end = addMonths(newDate, 3);
            this.model.endDate = endOfMonth(end);
            break;
          }
          case BUDGET_TYPE_OPTIONS.MID_YEAR: {
            const end = addMonths(newDate, 6);
            this.model.endDate = endOfMonth(end);
            break;
          }
          case BUDGET_TYPE_OPTIONS.YEARLY: {
            const end = addMonths(newDate, 12);
            this.model.endDate = endOfMonth(end);
            break;
          }
          default: {
            this.model.endDate = endOfMonth(newDate);
            break;
          }
        }
      } else {
        this.model.endDate = null;
      }
    },
    budget(value) {
      if (value) {
        this.model = value;
      }
    },
  },
})
export default class Add extends Vue {
  category = "";
  value = 0;
  categories!: categoryType[];
  availableCategories!: categoryType[];
  categoryMap!: Record<string, string>;
  budget!: modelType;
  lastBudget!: modelType;
  model: modelType = {
    startDate: "",
    endDate: "",
    items: [],
  };
  sub!: Transaction[];

  add(): void {
    this.model.items.push({
      category: this.category,
      value: this.value,
    });
    this.category = "";
    this.value = 0;
  }

  remove(category: string): void {
    this.model = {
      ...this.model,
      items:
        this.model.items?.filter((item) => item.category != category) || [],
    };
  }

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

    return `${month} ${day}, ${year}`;
  }

  created(): void {
    if (this.budget) {
      this.model = this.budget;
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/mixins.scss";

.budget {
  background: #ffffff;
  box-shadow: 0px 2px 5px rgba(54, 65, 86, 0.05);
  border-radius: 5px;
  padding: 20px 30px 30px;

  @include for-size(tablet-landscape-up) {
    min-width: 500px;
    max-height: 800px;
  }

  @at-root #{&}__header {
    display: flex;
    flex-direction: column;
    align-items: center;

    @include for-size(tablet-landscape-up) {
      align-items: flex-start;
    }
  }

  @at-root #{&}__nav {
    background: transparent;
    border: none;
    text-align: left;
    margin: 0 12px 0 0;

    @include for-size(tablet-landscape-up) {
      display: none;
    }
  }

  @at-root #{&}__title {
    font-weight: 700;
    font-size: 18px;
    line-height: 25px;
    margin-bottom: 20px;
  }

  @at-root #{&}__sub-header {
    margin-bottom: 10px;
  }

  @at-root #{&}__section {
    margin-bottom: 36px;
  }

  @at-root #{&}__section--alt {
    margin-bottom: 15px;
  }

  @at-root #{&}__section-description {
    font-weight: 400;
    font-size: 16px;
    line-height: 22px;
    color: #2a2a2a;
    margin-bottom: 10px;
  }

  @at-root #{&}__section-group--auto {
    max-height: 200px;
    overflow: auto;
  }

  @at-root #{&}__amount {
    font-weight: 700;
    font-size: 24px;
    margin-bottom: 10px;
  }

  @at-root #{&}__info {
    display: flex;
    background: #f1f4f7;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 24px;
  }

  @at-root #{&}__info-icon {
    margin-right: 10px;
  }

  @at-root #{&}__info-text {
    font-size: 12px;
    line-height: 18px;
  }

  @at-root #{&}__field-group {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  @at-root #{&}__field-group-item {
    width: 45%;
    position: relative;
  }

  @at-root #{&}__field-group-item--add {
    width: 30%;
  }

  @at-root #{&}__field-row {
    display: flex;
    align-items: flex-start;
  }

  @at-root #{&}__field-control {
    display: flex;
    flex-direction: column;

    input {
      padding-left: 10px;
    }
  }

  @at-root #{&}__field-label {
    font-weight: 600;
    font-size: 12px;
    line-height: 16px;
    margin-bottom: 4px;
  }

  @at-root #{&}__field-input {
    width: 100%;
    height: 40px;
    color: unset;
  }

  @at-root #{&}__field-checkbox {
    width: unset;
    height: unset;
    margin-right: 10px;
  }

  @at-root #{&}__field-action {
    background: transparent;
    border: none;
    text-align: left;
    position: absolute;
    top: 58%;
    left: 75%;
  }

  @at-root #{&}__append {
    background: transparent;
    border: none;
    text-align: center;
    font-size: 12px;
    line-height: 16px;
    color: #007cff;
    width: 100%;
  }

  @at-root #{&}__actions {
    margin-top: 2em;
    display: flex;
    flex-direction: column;
  }

  @at-root #{&}__list-row-item {
    font-size: 15px;
    text-align: left;
    padding: 5px;
  }

  @at-root #{&}__list-row-item--header {
    font-weight: 700;
  }

  @at-root #{&}__list-row-item-action {
    border: none;
    background: transparent;
    outline: none;
  }
  @at-root #{&}__list-row-empty {
    font-size: 15px;
    text-align: center;
    padding: 5px;
  }
}

.button {
  font-weight: 700;
  font-size: 14px;
  line-height: 19px;
  border: 1px solid #007cff;
  background: white;
  border-radius: 5px;
  color: #007cff;
  width: 100%;
  padding: 1em;
  width: unset;
  height: unset;
  cursor: pointer;

  @at-root #{&}--primary {
    background: #007cff;
    color: white;
    margin-bottom: 14px;
  }

  @at-root #{&}--disabled {
    background: grey !important;
    cursor: not-allowed;
  }
}

button {
  cursor: pointer;
}
</style>
