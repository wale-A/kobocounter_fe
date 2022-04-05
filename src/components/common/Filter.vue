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
        <div v-for="facet in facets" :key="facet.key" class="filter-input">
          <Multiselect
            v-if="facet.type == 'select'"
            v-model="model[facet.key]"
            :placeholder="facet.placeholder"
            :options="facet.options"
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
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Multiselect from "@vueform/multiselect";
@Options({
  components: { Multiselect },
  props: {
    activeFilters: {
      type: String,
      default: "No Results",
    },
  },
  data() {
    return {
      facets: [
        {
          key: "account",
          type: "select",
          placeholder: "Select an option",
          options: [
            { value: "all", label: "All your bank accounts" },
            { value: "207866554", label: "UBA - 207866554" },
            { value: "6544778899", label: "Zenith - 6544778899" },
            { value: "3244551177", label: "Kuda - 3244551177" },
            { value: "new", label: "+ Add a new account" },
          ],
        },
        {
          key: "period",
          type: "select",
          placeholder: "Select an option",
          options: [
            { value: "yesterday", label: "Yesterday" },
            { value: "last-week", label: "Past week" },
            { value: "last-month", label: "Last 30 days" },
            { value: "last-quarter", label: "Last 3 months" },
            { value: "last-year", label: "Past year" },
            { value: "custom", label: "Custom" },
          ],
        },
      ],
      model: {},
      showFilters: false,
    };
  },
  methods: {
    submit() {
      this.$emit("filter", this.model);
      this.showFilters = false;
    },
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
}
</style>
