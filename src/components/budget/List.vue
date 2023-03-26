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
            <!-- <td class="budget__header-item">Budget ID</td>
            <td class="budget__header-item">Status</td> -->
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
            <!-- <td class="budget__id">
              {{ item.name }}
            </td>
            <td class="budget__field budget__status">
              {{ item.status || "Active" }}
            </td> -->
            <td class="budget__field budget__start" style="font-size: 11px">
              {{ item.startDate.replaceAll("/", " / ") }}
            </td>
            <td class="budget__field budget__end" style="font-size: 11px">
              {{ item.endDate.replaceAll("/", " / ") }}
            </td>
            <td class="budget__field budget__budget">
              {{ item.value.toLocaleString() }}
            </td>
            <td class="budget__field budget__spend">
              {{ item.amountSpent.toLocaleString() }}
            </td>
            <td
              class="budget__field budget__insight"
              :class="{
                'budget__insight--red': item.amountSpent > item.value,
                'budget__insight--green': item.amountSpent < item.value,
              }"
            >
              <svg-icon
                v-if="item.amountSpent < item.value"
                :src="require('@/assets/svg/down-arrow.svg')"
                class="insight__change-icon"
              />
              <svg-icon
                v-if="item.amountSpent > item.value"
                :src="require('@/assets/svg/up-arrow.svg')"
                class="insight__change-icon"
              />
              <span class="insight__change-value" style="padding-left: 5px"
                >{{
                  (
                    ((item.amountSpent ? item.amountSpent - item.value : 0) /
                      item.value) *
                    100
                  ).toFixed(2)
                }}%</span
              >
            </td>
            <td class="budget__field-action">
              <button
                class="budget__action budget__action--clear"
                @click="toggleMenu()"
              >
                <svg-icon
                  :src="require('@/assets/svg/action-menu.svg')"
                  class="budget__action-icon"
                />
              </button>
              <div
                v-show="openMenu && active === item.id"
                v-click-outside="() => (openMenu = false)"
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
    highlight: {
      handler(newVal) {
        this.active = newVal;
      },
      immediate: true,
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
    padding: 0.5em;
  }

  @at-root #{&}__item {
    border-bottom: 1px solid #d9dbdb;
  }

  @at-root #{&}__item:hover {
    cursor: grab;
    background: #ecefef;
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
    padding: 0.5em;
  }

  @at-root #{&}__field-action {
    position: relative;
  }

  @at-root #{&}__action-item {
    padding: 15px;
  }

  @at-root #{&}__action-item:hover {
    border: black;
    outline: none;
    background: #d9dbdb;
    cursor: grab;
  }

  @at-root #{&}__action {
    padding: 5px;
  }

  @at-root #{&}__action--clear {
    border: none;
    outline: none;
    background: transparent;
    // cursor: grab;
  }

  @at-root #{&}__action--clear:hover {
    cursor: grab;
    font-weight: bold;
  }

  @at-root #{&}__action-menu {
    position: absolute;
    display: flex;
    flex-direction: column;
    width: 100px;
    background-color: #fff;
    right: 20px;
    top: 40px;
    background: #ffffff;
    box-shadow: 0px 2px 10px 2px rgba(54, 65, 86, 0.1);
    border-radius: 3px;
    z-index: 100;
  }

  @at-root #{&}__insight--red {
    color: rgba(222, 28, 98, 0.8);
  }
  @at-root #{&}__insight--green {
    color: rgb(65, 197, 118);
  }
}
</style>
