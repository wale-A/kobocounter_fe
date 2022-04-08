<template>
  <div class="filter">
    <div class="filter-results">{{ activeFilters }}</div>
    <button class="filter-trigger" @click="showFilters = !showFilters">
      <span class="filter-trigger-label">Filters</span>
      <svg-icon
        :src="require('@/assets/svg/filter-icon.svg')"
        class="filter-trigger-icon"
      />
    </button>
    <div v-if="showFilters" class="filter-facets">
      <div class="filter-list">
        <div v-for="field in fields" :key="field.key" class="filter-input">
          <Multiselect
            v-if="field.type == 'select'"
            v-model="modelValue[field.key]"
            :placeholder="field.placeholder"
            :options="field.options"
          />
        </div>
      </div>
      <div class="filter-actions">
        <button
          class="filter-action filter-action--cancel"
          @click="showFilters = false"
        >
          Cancel
        </button>
        <button class="filter-action filter-action--submit" @click="submit">
          View Results
        </button>
      </div>
    </div>
    <div v-if="showFilterOptions" class="filter-field-options">
      <RangePicker field="period" keyValue="custom" @update="processOption" />
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Multiselect from "@vueform/multiselect";
import RangePicker from "./RangePicker.vue";
@Options({
  components: { Multiselect, RangePicker },
  props: {
    activeFilters: {
      type: String,
      default: "No Results",
    },
    fields: {
      type: Array,
      required: true,
    },
    model: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      modelValue: null,
      additionalValue: null,
      showFilters: false,
      showFilterOptions: false,
    };
  },
  methods: {
    getValue(model: Record<string, any>) {
      return Object.keys(model).reduce((acc, key) => {
        const field = (this.fields as any[]).find(
          (item: any) => item.key === key
        );
        return {
          ...acc,
          [key]:
            field.sanitizeValue && typeof field.sanitizeValue === "function"
              ? field.sanitizeValue(model[key])
              : model[key],
        };
      }, {});
    },
    getAdditionalValue() {
      return (this.fields as any[]).reduce(
        (
          acc: Record<string, any>,
          { key, valueActions }: { key: string; valueActions: any[] }
        ) => {
          return {
            ...acc,
            ...valueActions.reduce(
              (_acc, item) => ({ ..._acc, [`${key}.${item.key}`]: null }),
              {}
            ),
          };
        },
        {}
      );
    },
    processOption(input: any) {
      this.showFilters = true;
      this.showFilterOptions = false;
      this.additionalValue[`${input.field}.${input.key}`] = {
        name: input.key,
        ...input.value,
      };
      console.log("additional", this.additionalValue);
    },
    submit() {
      const value = Object.entries(this.modelValue).reduce(
        (acc, [key, value]) => {
          const field = (this.fields as any[]).find(
            (item: any) => item.key === key
          );
          const valueOption = field.options.find(
            (item: any) => item.value == value
          );
          return {
            ...acc,
            [key]:
              this.additionalValue[`${field.key}.${valueOption.value}`] ||
              valueOption.nativeValue ||
              valueOption.value,
          };
        },
        {}
      );
      this.$emit("filter", value);
      this.showFilters = false;
    },
  },
  watch: {
    "modelValue.period"(newVal) {
      if (newVal == "custom") {
        this.showFilters = false;
        this.showFilterOptions = true;
      }
    },
    model(newVal) {
      this.modelValue = this.getValue(newVal);
    },
  },
  created() {
    this.modelValue = this.getValue(this.model);
    this.additionalValue = this.getAdditionalValue();
  },
})
export default class Filter extends Vue {}
</script>

<style lang="scss" scoped>
.filter {
  align-items: center;
  display: flex;
  position: relative;

  &-results {
    color: #727376;
    font-family: "Nunito Sans";
    font-size: 13px;
    line-height: 18px;
    margin-right: 12px;
  }

  &-trigger {
    align-items: center;
    background: #ffffff;
    box-shadow: 0px 4px 15px 4px rgba(54, 65, 86, 0.1);
    border: none;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
    margin-right: 24px;
    padding: 8px 29px 8px 21px;
  }

  &-trigger-label {
    color: #727376;
    font-family: "Nunito Sans";
    font-size: 18px;
    line-height: 25px;
    margin-right: 24px;
  }

  &-facets {
    position: absolute;
    display: flex;
    flex-direction: column;
    width: 278px;
    background: #ffffff;
    box-shadow: 0px 0px 15px rgba(54, 65, 86, 0.1);
    border-radius: 10px;
    padding: 28px 22px 20px 15px;
    top: 65px;
    right: 20px;
  }

  &-input {
    margin-bottom: 13px;
  }

  &-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 17px;
  }
  &-action {
    border: 1px solid #007cff;
    box-sizing: border-box;
    border-radius: 5px;
    font-weight: 700;
    font-size: 13px;
    line-height: 18px;
    padding: 7px 13px;
    width: 45%;
  }
  &-action--cancel {
    background: #ffffff;
    color: #007cff;
  }
  &-action--submit {
    background: #007cff;
    color: #ffffff;
  }

  &-field-options {
    position: absolute;
    width: 278px;
    background: #ffffff;
    box-shadow: 0px 4px 15px 4px rgba(54, 65, 86, 0.1);
    border-radius: 10px;
    padding: 6px 0;
    top: 65px;
    right: 20px;
  }
}
</style>
