<template>
  <div class="filter" :class="{ 'filter--no-display': !displayText }">
    <div v-if="displayText" class="filter__results">{{ displayText }}</div>
    <button
      class="filter__trigger"
      :class="{ 'filter__trigger--no-shadow': !displayText }"
      @click="showFilters = !showFilters"
    >
      <span class="filter__trigger-label">Filters</span>
      <svg-icon
        :src="require('@/assets/svg/filter-icon.svg')"
        class="filter__trigger-icon"
      />
    </button>
    <div v-if="showFilters" class="filter__facets">
      <div class="filter-list">
        <div v-for="field in fields" :key="field.key" class="filter-input">
          <label class="filter-label">{{ field.label }}</label>
          <div class="filter-control">
            <Multiselect
              v-if="field.type == 'select'"
              v-model="modelValue[field.key]"
              :placeholder="field.placeholder"
              :options="field.options"
              :classes="{ options: 'filter-dropdown' }"
              :mode="field.multiSelect ? 'multiple' : 'single'"
              class="filter-select"
            />
            <textarea
              v-if="field.type == 'textarea'"
              v-model="modelValue[field.key]"
              :placeholder="field.placeholder"
              class="filter-textarea"
            ></textarea>
            <span
              v-if="additionalValue[`${field.key}.${modelValue[field.key]}`]"
              class="filter-edit material-icons"
              @click="displayFilterOptions"
              >edit</span
            >
          </div>
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
      <component
        :is="
          fieldValueComponentMap[`${activeField}.${modelValue[activeField]}`]
        "
        :field="activeField"
        :keyValue="modelValue[activeField]"
        :value="additionalValue[`${activeField}.${modelValue[activeField]}`]"
        @cancel="processOption"
        @update="processOption"
      />
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
    displayText: {
      type: String,
      required: true,
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
      activeField: null,
    };
  },
  computed: {
    fieldMap() {
      return (this.fields as any[]).reduce(
        (acc: Record<string, any>, item: any) => {
          return {
            ...acc,
            [item.key]: {
              field: item,
              options: item.options.reduce(
                (_acc: Record<string, any>, _item: any) => {
                  return { ..._acc, [_item.value]: _item };
                },
                {}
              ),
              valueActions: item.valueActions.reduce(
                (_acc: Record<string, any>, _item: any) => {
                  return { ..._acc, [_item.key]: _item };
                },
                {}
              ),
            },
          };
        },
        {}
      );
    },
    fieldValueComponentMap() {
      return this.fields.reduce(
        (
          acc: Record<string, string>,
          { key, valueActions }: { key: string; valueActions: any[] }
        ) => {
          return {
            ...acc,
            ...valueActions.reduce(
              (_acc, item) => ({
                ..._acc,
                [`${key}.${item.key}`]: item.component,
              }),
              {}
            ),
          };
        },
        {}
      );
    },
  },
  methods: {
    getValue(model: Record<string, any>) {
      return Object.keys(model).reduce((acc, key) => {
        const field = this.fieldMap[key].field;
        return {
          ...acc,
          [key]:
            field.sanitizeValue && typeof field.sanitizeValue === "function"
              ? field.sanitizeValue(model[key])
              : model[key],
        };
      }, {});
    },
    getAdditionalFields(model: Record<string, any>) {
      return model.reduce(
        (
          acc: Record<string, string>,
          { key, valueActions }: { key: string; valueActions: any[] }
        ) => {
          return {
            ...acc,
            ...valueActions.reduce(
              (_acc, item) => ({
                ..._acc,
                [`${key}.${item.key}`]: { field: key, ...item },
              }),
              {}
            ),
          };
        },
        {}
      );
    },
    initAdditionalFields(model: Record<string, any>) {
      return Object.keys(model).reduce((_acc, key) => {
        return { ..._acc, [key]: null };
      }, {});
    },
    watchAdditionalValues(model: Record<string, any>) {
      Object.keys(model).forEach((key) => {
        const field = model[key].field;
        this.$watch(
          () => this.modelValue[field] === model[key].key,
          (newVal: boolean) => {
            if (newVal && model[key].type === "input") {
              this.activeField = field;
              this.displayFilterOptions();
            } else if (newVal && model[key].type === "emit") {
              this.$emit(`update:${field}`, this.modelValue[field]);
              this.showFilters = false;
            }
          }
        );
      });
    },
    processOption(input: any) {
      this.displayFilters();
      if (input.value) {
        this.additionalValue[`${input.field}.${input.key}`] = {
          name: input.key,
          ...input.value,
        };
      } else {
        if (
          !this.additionalValue[`${input.field}.${input.key}`] &&
          this.fieldMap[input.field]?.field?.defaultValue
        ) {
          this.modelValue[input.field] =
            this.fieldMap[input.field]?.field?.defaultValue;
        }
      }
    },
    submit() {
      const value = Object.entries(this.modelValue).reduce(
        (acc, [key, value]) => {
          const field = this.fieldMap[key].field;
          const valueOption = this.fieldMap[key].options[value as string];

          if (valueOption) {
            return {
              ...acc,
              [key]:
                this.additionalValue[`${field.key}.${valueOption.value}`] ||
                valueOption.nativeValue ||
                valueOption.value,
            };
          } else {
            return { ...acc, [key]: value };
          }
        },
        {}
      );
      this.$emit("filter", value);
      this.showFilters = false;
    },
    displayFilters() {
      this.showFilters = true;
      this.showFilterOptions = false;
    },
    displayFilterOptions() {
      this.showFilters = false;
      this.showFilterOptions = true;
    },
  },
  watch: {
    model(newVal) {
      this.modelValue = this.getValue(newVal);
    },
  },
  created() {
    this.modelValue = this.getValue(this.model);
    const fields = this.getAdditionalFields(this.fields);
    this.additionalValue = this.initAdditionalFields(fields);
    this.watchAdditionalValues(fields);
  },
})
export default class Filter extends Vue {}
</script>

<style lang="scss" scoped>
@import "@/styles/mixins.scss";
.filter {
  align-items: center;
  display: flex;
  position: relative;
  z-index: 1000;

  @at-root #{&}--no-display {
    justify-content: flex-end;
  }

  @at-root #{&}__results {
    color: #727376;
    font-family: "Nunito Sans";
    font-size: 13px;
    line-height: 18px;
    margin-right: 12px;
  }

  @at-root #{&}__trigger {
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

  @at-root #{&}__trigger--no-shadow {
    border: 1px solid #364156;
    border-radius: 5px;
    box-shadow: unset;
    margin-top: 19px;
    margin-bottom: 5px;
  }

  @at-root #{&}__trigger-label {
    color: #727376;
    font-family: "Nunito Sans";
    font-weight: 400;
    font-size: 14px;
    line-height: 19px;
    margin-right: 9px;
    @include for-size(tablet-landscape-up) {
      font-size: 18px;
      line-height: 25px;
      margin-right: 24px;
    }
  }

  @at-root #{&}__facets {
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

  &-control {
    display: flex;
    align-items: center;

    textarea {
      border: 1px solid rgb(231, 231, 231);
      border-radius: 3px;
      padding: 0.5em 0.8em;
      width: 100%;
      font-size: 1em;
    }
  }

  &-select {
    flex: 1;
  }

  &-dropdown {
    max-height: 270px;
  }

  &-edit {
    width: 20px;
    margin-left: 5px;
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
    background: transparent;
    padding: 6px 0;
    top: 65px;
    right: 20px;
  }
}
</style>
