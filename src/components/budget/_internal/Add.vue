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
        <span class="budget__title">Create a new budget</span>
      </h1>
      <p class="budget__subtitle">Choose a date for your budget</p>
    </div>
    <form class="budget__form">
      <div>
        <div class="budget__field-group">
          <div class="budget__field-group-item">
            <label class="budget__field-label">From</label>
            <Datepicker v-model="model.startDate" class="budget__field-input" />
          </div>
          <div class="budget__field-group-item">
            <label class="budget__field-label">To</label>
            <input
              v-model="model.endDate"
              type="text"
              class="budget__field-input"
            />
          </div>
        </div>
        <div class="budget__field-group">
          <label for="reuse" class="budget__field">
            <input
              id="reuse"
              name="reuse"
              type="checkbox"
              v-model="model.reuse"
              class="budget__field-checkbox"
            />
            <span
              >Re-use this budget for the same number of days after it
              expires</span
            >
          </label>
        </div>
      </div>
      <div
        class="budget__field-group"
        v-for="(item, index) in model.items"
        :key="index"
      >
        <div class="budget__field-group-item">
          <label class="budget__field-label">Choose category</label>
          <Multiselect
            v-model="item.category"
            :searchable="true"
            :options="availableCategories"
            noResultsText="No result found"
            class="budget__field-input"
          />
        </div>
        <div class="budget__field-group-item">
          <label class="budget__field-label">Enter Amount</label>
          <input
            v-model="item.value"
            type="number"
            class="budget__field-input"
            min="0"
          />
          <button
            v-if="index > 0"
            class="budget__field-action"
            @click.stop="remove(index)"
          >
            <svg-icon
              :src="require('@/assets/svg/del.svg')"
              class="budget__input-icon"
            />
          </button>
        </div>
      </div>

      <button class="budget__append" @click.prevent="add">
        + Add New Split
      </button>
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
    </form>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Multiselect from "@vueform/multiselect";
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { SplitTransaction, Transaction } from "@/types";

type categoryType = { value: number; label: string };
@Options({
  components: { Multiselect, Datepicker },
  props: {
    categories: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      model: {
        startDate: "",
        endDate: "",
        items: [{ category: "", value: null }],
      },
    };
  },
  computed: {
    availableCategories() {
      const activeCategories = this.model.items.map(
        (item: categoryType) => item.value
      );
      return this.categories.filter(
        (category: categoryType) => !activeCategories.includes(category.value)
      );
    },
    canSubmit() {
      return (
        this.model.every(
          (x: SplitTransaction) => x.expenseCategory && x.amount
        ) && this.splitTransactionTotal <= Math.abs(this.transaction.amount)
      );
    },
  },
})
export default class Add extends Vue {
  categories!: categoryType[];
  model!: {
    startDate: string;
    endDate: string;
    items: {
      category: string;
      value: null | number;
    }[];
  };
  sub!: Transaction[];

  add(): void {
    this.model.items.push({
      category: "",
      value: null,
    });
  }

  remove(index: number): void {
    this.model.items.splice(index, 1);
  }
}
</script>

<style lang="scss" scoped>
.budget {
  @at-root #{&}__header {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
  }
  @at-root #{&}__nav {
    background: transparent;
    border: none;
    text-align: left;
    margin: 0 12px 0 0;
  }
  @at-root #{&}__title {
    font-weight: 700;
    font-size: 18px;
    line-height: 25px;
  }
  @at-root #{&}__sub-header {
    margin-bottom: 10px;
  }
  @at-root #{&}__sub-title {
    font-weight: 600;
    font-size: 14px;
    line-height: 19px;
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
  @at-root #{&}__field-label {
    font-weight: 600;
    font-size: 12px;
    line-height: 16px;
    margin-bottom: 4px;
  }
  @at-root #{&}__field-input {
    max-width: 100%;
    color: unset;
    padding-left: 1em;
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
