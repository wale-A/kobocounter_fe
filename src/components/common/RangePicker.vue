<template>
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
    key: {
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
      start: new Date(),
      end: null,
    };
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
  },
  watch: {
    start() {
      this.$refs.endPicker.openMenu();
    },
    end() {
      this.$emit("update", {
        key: `${this.field}.${this.key}`,
        value: { start: this.start, end: this.end },
      });
    },
  },
})
export default class RangePicker extends Vue {}
</script>

<style lang="scss" scoped>
.range-picker {
  display: flex;
  justify-content: center;

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
}
</style>
