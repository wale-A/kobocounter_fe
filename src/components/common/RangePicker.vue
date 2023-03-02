<template>
  <div class="range-picker">
    <div class="range-picker-triggers">
      <div role="button" class="range-picker-input" @click="setActive('start')">
        <span class="range-picker-label">Start Date</span>
        <span class="range-picker-date">{{ format(model.start) }}</span>
      </div>
      <div class="range-picker-divider"></div>

      <div role="button" class="range-picker-input" @click="setActive('end')">
        <span class="range-picker-label">End Date</span>
        <span class="range-picker-date">{{ format(model.end) }}</span>
      </div>
    </div>
    <div class="range-picker-calendar">
      <Datepicker
        v-if="active === 'start'"
        v-model="model.start"
        class="range-picker-trigger"
        :enableTimePicker="false"
        format="MM/dd/yy"
        inline
        autoApply
        keepActionRow
        @update:modelValue="handleDate"
      >
        <template #action-select>
          <div class="range-picker-actions">
            <button
              class="range-picker-action range-picker-action--cancel"
              @click="cancel"
            >
              Cancel
            </button>
            <button
              class="range-picker-action range-picker-action--submit"
              :class="{ 'range-picker-action--disabled': !canSubmit }"
              :disabled="!canSubmit"
              @click="submit"
            >
              Ok
            </button>
          </div>
        </template>
      </Datepicker>
      <Datepicker
        v-else
        v-model="model.end"
        class="range-picker-trigger"
        :enableTimePicker="false"
        format="MM/dd/yy"
        inline
        autoApply
        keepActionRow
        @update:modelValue="handleDate"
      >
        <template #action-select>
          <div class="range-picker-actions">
            <button
              class="range-picker-action range-picker-action--cancel"
              @click="cancel"
            >
              Cancel
            </button>
            <button
              class="range-picker-action range-picker-action--submit"
              :class="{ 'range-picker-action--disabled': !canSubmit }"
              :disabled="!canSubmit"
              @click="submit"
            >
              Ok
            </button>
          </div>
        </template>
      </Datepicker>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

@Options({
  components: { Datepicker },
  props: {
    field: {
      type: String,
      required: true,
    },
    keyValue: {
      type: String,
      required: true,
    },
    value: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      model: { start: this.value?.start, end: this.value?.end },
      active: "start",
      date: this.value?.start,
    };
  },
  computed: {
    canSubmit() {
      return this.model.start && this.model.end;
    },
  },
  methods: {
    setActive(type) {
      this.active = type;
      this.date = this.model[type];
    },
    format(date) {
      if (!date) {
        return "";
      }
      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
      };
      return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
    },
    cancel() {
      this.$emit("cancel", {
        field: this.field,
        key: this.keyValue,
        value: null,
      });
    },
    submit() {
      this.$emit("update", {
        field: this.field,
        key: this.keyValue,
        value: this.model,
      });
    },
  },
  watch: {
    "model.start"() {
      this.active = "end";
    },
  },
})
export default class RangePicker extends Vue {}
</script>

<style lang="scss">
.dp__menu {
  width: 100%;
  border: none;
  box-shadow: 0px 4px 15px 4px rgba(54, 65, 86, 0.1);
}
</style>

<style lang="scss" scoped>
.range-picker {
  &-triggers {
    display: flex;
    justify-content: center;
    min-height: 47px;
    margin-bottom: 20px;
    box-shadow: 0px 4px 15px 4px rgba(54, 65, 86, 0.1);
    border-radius: 10px;
    background: #ffffff;
    padding: 7px;
  }

  &-input {
    display: flex;
    flex-direction: column;
    min-width: 30%;
  }

  &-label {
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    color: #727376;
  }

  &-date {
    font-weight: 700;
    font-size: 14px;
    line-height: 19px;
    color: #727376;
  }

  &-divider {
    display: inline-block;
    border-left: 1px solid rgba(217, 219, 219, 0.25);
    margin: 0 20px;
  }

  &-calendar {
    margin-bottom: 20px;
  }

  &-actions {
    display: flex;
    justify-content: space-between;
  }
  &-action {
    border: 1px solid #007cff;
    box-sizing: border-box;
    border-radius: 5px;
    font-weight: 700;
    font-size: 13px;
    line-height: 18px;
    padding: 5px;
    width: 48%;
  }
  &-action--cancel {
    background: #ffffff;
    color: #007cff;
  }
  &-action--submit {
    background: #007cff;
    color: #ffffff;
  }
  &-action--disabled {
    background: grey;
  }
}
</style>
