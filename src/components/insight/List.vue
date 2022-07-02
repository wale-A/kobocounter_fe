<template>
  <Panel :title="title" class="insight">
    <template v-slot:title>
      <div class="insight__header">
        <p class="insight__title">{{ title }}</p>
        <div class="insight__subtitle">{{ subtitle }}</div>
      </div>
    </template>
    <div class="insight__body">
      <table v-if="insights" class="insight__list">
        <tr
          v-for="item in insights"
          :key="item.category"
          class="insight__item"
          :class="{
            'insight__item--active': item.category === active,
          }"
          @click.stop="selectInsight(item.category)"
        >
          <td class="insight__progress">
            <div class="insight__progress-group">
              <span class="insight__category">
                {{ item.category }}
              </span>
              <progress
                max="100"
                :value="div(item.amount, item.budgetAmount) * 100"
                class="insight__progress-bar"
              ></progress>
            </div>
          </td>
          <td class="insight__budget">N {{ item.amount.toLocaleString() }}</td>
          <td
            class="insight__change"
            :class="{
              'insight__change--red': item.change < 0,
              'insight__change--green': item.change > 0,
            }"
          >
            <svg-icon
              v-if="item.change > 0"
              :src="require('@/assets/svg/down-arrow.svg')"
              class="insight__change-icon"
            />
            <svg-icon
              v-if="item.change < 0"
              :src="require('@/assets/svg/up-arrow.svg')"
              class="insight__change-icon"
            />
            <span class="insight__change-value"
              >{{ Math.abs(item.change).toLocaleString() }}%</span
            >
          </td>
        </tr>
      </table>
    </div>
  </Panel>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Panel from "@/components/layout/Panel.vue";

@Options({
  components: {
    Panel,
  },
  props: {
    highlight: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      default: "Expenses by Category",
    },
    subtitle: {
      type: String,
      default: `
        The progress bar shows how much you have spent on the category based on your budget.
        
        The percentage (%) values shows how much has been spent on that category compared to the previous date period.
      `,
    },
    insights: {
      type: Array,
      required: true,
    },
  },
  watch: {
    highlight(newVal) {
      this.active = newVal;
    },
  },
})
export default class List extends Vue {
  active = "";

  selectInsight(id: string): void {
    this.active = id;
    this.$emit("select", id);
  }

  // if the denum is zero, it means there was no expense for this category in the previous date period
  // therefor the user has spent 100% more this month
  div(num: number, denum: number): number {
    if (!denum) {
      return -100;
    }
    return num / denum;
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/mixins.scss";
.insight {
  font-size: 15px;
  color: #364156;

  @at-root #{&}__title {
    font-weight: 700;
    font-size: 20px;
    line-height: 22px;
    color: #2a2a2a;
    margin-bottom: 10px;
    @include for-size(tablet-landscape-up) {
      font-size: 18px;
      line-height: 22px;
    }
  }

  @at-root #{&}__subtitle {
    font-size: 15px;
    line-height: 18px;
    color: #2a2a2a;
    max-width: 500px;
    margin-top: 6px;
  }

  @at-root #{&}--no-shadow {
    @media (max-width: 991px) {
      box-shadow: none;
    }
  }

  @at-root #{&}__list {
    border-collapse: collapse;
  }

  @at-root #{&}__item {
    border-bottom: 1px solid #d9dbdb;
  }

  @at-root #{&}__item--active {
    background: #d9dbdb;
  }

  @at-root #{&}__progress {
    width: 65%;
  }

  @at-root #{&}__progress-group {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  @at-root #{&}__category {
    font-weight: 600;
    font-size: 14px;
    line-height: 19px;
    margin-bottom: 3px;
  }

  @at-root #{&}__progress-bar {
    width: 100%;
    color: black;
  }

  @at-root #{&}__budget {
    font-weight: 600;
    font-size: 14px;
    line-height: 16px;
  }

  @at-root #{&}__change {
    font-weight: 700;
    font-size: 14px;
    line-height: 14px;
  }

  @at-root #{&}__change--red {
    color: rgba(222, 28, 98, 0.7);
  }

  @at-root #{&}__change--green {
    color: rgba(111, 205, 199, 0.8);
  }

  @at-root #{&}__change-icon {
    margin-right: 4px;
  }
}
</style>
