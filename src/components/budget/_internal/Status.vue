<template>
  <div class="status">
    <h3 class="status__title">{{ title }}</h3>
    <img :src="iconPath" class="status__icon" />
    <p class="status__subtitle">{{ message }}</p>
    <button class="status__action" @click="$emit('close')">
      {{ buttonLabel }}
    </button>
  </div>
</template>

<script lang="ts">
import { format } from "date-fns";
import { Options, Vue } from "vue-class-component";
type categoryType = { value: number; label: string };
@Options({
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
      return this.budget.items.reduce((acc: number, category: categoryType) => {
        return (acc += category.value);
      }, 0);
    },
    title() {
      return `Your budget has been ${
        this.editing ? "updated" : "created"
      } successfully!`;
    },
    message() {
      return `You have a total budget of ${
        this.total
      } effective from ${this.formatDate(
        this.budget.startDate
      )} to ${this.formatDate(this.budget.endDate)}`;
    },
  },
})
export default class Status extends Vue {
  iconPath = "/img/assets/no-accounts.svg";
  buttonLabel = "Close";

  formatDate(date: string): string {
    if (!date) {
      return "";
    }
    const [withoutTime] = date.split("T");
    return format(new Date(withoutTime), "MM/dd/yyyy");
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/mixins.scss";

.status {
  background: #ffffff;
  box-shadow: 0px 2px 5px rgba(54, 65, 86, 0.05);
  border-radius: 5px;
  padding: 20px 30px 30px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 15%;

  @include for-size(tablet-landscape-up) {
    min-width: 500px;
    max-height: 700px;
  }

  @at-root #{&}__icon {
    width: 100%;
    margin-bottom: 24px;

    @include for-size(tablet-landscape-up) {
      width: 220px;
      height: 100px;
    }
  }

  @at-root #{&}__title {
    font-weight: 700;
    font-size: 24px;
    line-height: 33px;
    margin-bottom: 0.4em;
    color: #2a2a2a;
  }

  @at-root #{&}__subtitle {
    font-size: 16px;
    line-height: 22px;
    color: rgba(42, 42, 42, 0.85);
    margin-bottom: 13px;
  }

  @at-root #{&}__action {
    width: 100%;
    padding: 9px 12px;
    border-radius: 5px;
    font-weight: 600;
    font-size: 16px;
    line-height: 22px;
    transition: all 0.2s ease-in 0s;
    cursor: pointer;
    margin: 0;
    color: white;
    background-color: #007cff;
    border-color: transparent;

    @include for-size(tablet-landscape-up) {
      width: initial;
    }
  }
}
</style>
