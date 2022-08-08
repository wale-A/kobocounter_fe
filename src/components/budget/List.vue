<template>
  <Panel :title="true" class="budget">
    <template v-slot:title>
      <div class="budget__header">
        <p class="budget__title">All Budgets</p>
      </div>
    </template>
    <div class="budget__body">
      <table v-if="budgets" class="budget__list">
        <thead>
          <tr class="budget__header">
            <td class="budget__header-item">Budget ID</td>
            <td class="budget__header-item">Status</td>
            <td class="budget__header-item">Start Date</td>
            <td class="budget__header-item">End Date</td>
            <td class="budget__header-item">Budget</td>
            <td class="budget__header-item">Expenses</td>
            <td class="budget__header-item">Insight</td>
            <td class="budget__header-item"></td>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in budgets"
            :key="item.category"
            class="budget__item"
            :class="{
              'budget__item--active': item[keyValue] == active,
            }"
            @click.stop="selectBudget(item[keyValue])"
          >
            <td class="budget__id">
              {{ item.id }}
            </td>
            <td class="budget__field budget__status">
              {{ item.status || "Active" }}
            </td>
            <td class="budget__field budget__start">{{ item.startDate }}</td>
            <td class="budget__field budget__end">{{ item.endDate }}</td>
            <td class="budget__field budget__budget">N {{ item.value }}</td>
            <td class="budget__field budget__spend">
              N {{ item.amountSpent }}
            </td>
            <td class="budget__field budget__insight"></td>
            <td class="budget__field-action budget__action"></td>
          </tr>
        </tbody>
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
    budgets: {
      type: Array,
      required: true,
    },
    keyValue: {
      type: String,
      default: "id",
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

  selectBudget(id: string): void {
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
.budget {
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
    font-size: 12px;
    line-height: 20px;
    color: #2a2a2a;
    max-width: 600px;
    margin-top: 6px;
    font-family: Nunito Sans;
  }

  @at-root #{&}--no-shadow {
    @media (max-width: 991px) {
      box-shadow: none;
    }
  }

  @at-root #{&}__list {
    border-collapse: collapse;
  }

  @at-root #{&}__header-item {
    font-weight: 700;
    font-size: 11px;
    color: #364156;
    line-height: 15px;
    text-align: left;
  }

  @at-root #{&}__item {
    border-bottom: 1px solid #d9dbdb;
  }

  @at-root #{&}__item--active {
    background: #d9dbdb;
  }

  @at-root #{&}__field {
    font-size: 12px;
    line-height: 16px;
    color: #364156;
    text-align: left;
  }
}
</style>
