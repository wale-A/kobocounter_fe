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
            :key="item.id"
            class="budget__item"
            :class="{
              'budget__item--active': item[keyValue] == active,
            }"
            @click.stop="selectBudget(item[keyValue])"
          >
            <td class="budget__field budget__start">
              {{ getDate(item.startDate) }}
            </td>
            <td class="budget__field budget__end">
              {{ getDate(item.endDate) }}
            </td>
            <td class="budget__field budget__budget">N {{ item.value }}</td>
            <td class="budget__field budget__spend">
              N {{ item.amountSpent }}
            </td>
            <td class="budget__field budget__insight"></td>
            <td class="budget__field-action">
              <button
                class="budget__action budget__action--clear"
                @click="toggleMenu()"
              >
                <svg-icon
                  :src="'/img/assets/svg/action-menu.svg'"
                  class="budget__action-icon"
                />
              </button>
              <div
                v-show="openMenu && active === item.id"
                class="budget__action-menu"
              >
                <button
                  v-if="showEdit"
                  class="budget__action-item budget__action--clear"
                  @click="emit('edit')"
                >
                  Edit
                </button>
                <button
                  class="budget__action-item budget__action--clear"
                  @click="emit('delete')"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </Panel>
</template>

<script lang="ts">
import Panel from "@/components/layout/Panel.vue";
import { BUDGET_TYPE_OPTIONS, MONTH_NAMES } from "@/config";
import {
  format,
  getMonth,
  getQuarter,
  getWeek,
  getWeekOfMonth,
  getYear,
} from "date-fns";
import { Options, Vue } from "vue-class-component";

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
    budgetType: {
      type: String,
      default: "monthly",
    },
    showEdit: {
      type: Boolean,
      default: false,
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
  openMenu = false;
  budgetType!: string;
  showEdit!: boolean;

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

  toggleMenu(): void {
    this.openMenu = !this.openMenu;
  }

  emit(action: string): void {
    this.$emit(action, this.active);
    this.toggleMenu();
  }

  getName(startDate: string): string {
    const date = new Date(startDate);
    switch (this.budgetType) {
      case BUDGET_TYPE_OPTIONS.WEEKLY:
        return `Week ${getWeek(date)}`;
      case BUDGET_TYPE_OPTIONS.BI_WEEKLY:
        return `${MONTH_NAMES[getMonth(date)]} WEEK-GROUP ${
          getWeekOfMonth(date) < 2 ? "1" : "2"
        }`;
      case BUDGET_TYPE_OPTIONS.BI_MONTHLY:
        return `MONTH-GROUP ${(getMonth(date) + 1) / 2}`;
      case BUDGET_TYPE_OPTIONS.QUATERLY:
        return `Quater ${getQuarter(date)}`;
      case BUDGET_TYPE_OPTIONS.MID_YEAR:
        return getMonth(date) < 6 ? `First Half` : "Second Half";
      case BUDGET_TYPE_OPTIONS.YEARLY:
        return `Year ${getYear(date)}`;
      default:
        return MONTH_NAMES[getMonth(date)];
    }
  }

  getDate(date: string): string {
    const [withoutTime] = date.split("T");
    return format(new Date(withoutTime), "MM/dd/yyyy");
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
    position: relative;
  }

  @at-root #{&}__field-action {
    position: relative;
  }

  @at-root #{&}__action-item {
    padding: 15px;
  }

  @at-root #{&}__action {
    padding: 5px;
  }

  @at-root #{&}__action--clear {
    border: none;
    outline: none;
    background: transparent;
  }

  @at-root #{&}__action-menu {
    position: absolute;
    display: flex;
    flex-direction: column;
    width: 132px;
    background-color: #fff;
    right: 20px;
    top: 40px;
    background: #ffffff;
    box-shadow: 0px 2px 10px 2px rgba(54, 65, 86, 0.1);
    border-radius: 3px;
    z-index: 100;
  }
}
</style>
