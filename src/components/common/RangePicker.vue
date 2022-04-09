<template>
  <div class="range-picker-wrapper">
    <div class="range-picker">
      <Datepicker
        ref="startPicker"
        v-model="start"
        class="range-picker-trigger"
        :enableTimePicker="false"
        format="MM/dd/yy"
        position="left"
      >
        <template #trigger>
          <div class="range-picker-input">
            <span class="range-picker-label">Start Date</span>
            <span class="range-picker-date">{{ format(start) }}</span>
          </div>
        </template>
      </Datepicker>
      <div class="range-picker-divider"></div>
      <Datepicker
        ref="endPicker"
        v-model="end"
        class="range-picker-trigger"
        :enableTimePicker="false"
        format="MM/dd/yy"
        position="right"
      >
        <template #trigger>
          <div class="range-picker-input">
            <span class="range-picker-label">End Date</span>
            <span class="range-picker-date">{{ format(end) }}</span>
          </div>
        </template>
      </Datepicker>
    </div>
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
  </div>
</template>

<script>
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
      start: this.value?.start,
      end: this.value?.end,
    };
  },
  computed: {
    canSubmit() {
      return this.start && this.end;
    },
  },
  methods: {
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
        value: { start: this.start, end: this.end },
      });
    },
  },
  watch: {
    start() {
      this.$refs.endPicker.openMenu();
    },
  },
  mounted() {
    this.$refs.startPicker.openMenu();
  },
})
export default class RangePicker extends Vue {}
</script>

<style lang="scss" scoped>
.range-picker {
  display: flex;
  justify-content: center;
  margin-bottom: 380px;

  &-trigger {
    min-width: 30%;
  }

  &-input {
    display: flex;
    flex-direction: column;
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

  &-actions {
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    margin-bottom: 20px;
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
  &-action--disabled {
    background: grey;
  }
}
</style>
