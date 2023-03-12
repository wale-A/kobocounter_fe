import {
  Budget,
  BudgetListItem,
  BudgetListResponse,
  BudgetPayload,
  FilterParams,
  Pagination,
} from "@/types";
import api from "@/api";
import { differenceInDays } from "date-fns";
import { Module } from "vuex";

type State = {
  budget: Budget | undefined;
  budgets: BudgetListItem[] | undefined;
  pagination: Pagination | undefined;
};

const budgets: Module<State, any> = {
  state: () => ({
    budget: undefined,
    budgets: undefined,
    pagination: undefined,
  }),
  getters: {
    budgets(state) {
      return (
        state.budgets?.sort((itemA, itemB) =>
          differenceInDays(new Date(itemA.endDate), new Date(itemB.endDate))
        ) || []
      );
    },
    budgetMap(state) {
      return (state.budgets || []).reduce(
        (acc, item) => ({ ...acc, [item.id]: item }),
        {}
      );
    },
    lastBudget(state) {
      const last =
        state.budgets?.length && state.budgets[state.budgets.length - 1];
      console.log({ last });
      return last;
    },
    budget(state) {
      return state.budget || null;
    },
  },
  mutations: {
    setBudgets(state, budgets?: BudgetListResponse) {
      state.budgets = budgets?.data;
    },
    setBudget(state, budget?: Budget) {
      state.budget = budget;
    },
  },
  actions: {
    async getBudgets(
      { commit },
      { category, start, end, page, size }: FilterParams
    ) {
      try {
        const res = await api.getBudgets({
          category,
          start,
          end,
          page,
          size,
        });
        commit("setBudgets", res.data);
      } catch (e) {
        commit("setBudgets", []);
      }
    },
    async getBudget({ commit }, id: string) {
      try {
        const res = await api.getBudget(id);
        commit("setBudget", res.data);
      } catch (e) {
        commit("setBudget", null);
      }
    },
    async postBudget(_, payload: BudgetPayload) {
      const res = await api.postBudget(payload);
      return res;
    },
    async putBudget(
      _,
      { id, payload }: { id: string; payload: BudgetPayload }
    ) {
      const res = await api.putBudget(id, payload);
      return res;
    },
    async deleteBudget(_, id: string) {
      const res = await api.deleteBudget(id);
      return res;
    },
    async getSingleBudget({ commit }, id: string) {
      try {
        const res = await api.getSingleBudget(id);
        commit("setBudget", res.data);
      } catch (e) {
        commit("setBudget", undefined);
      }
    },
  },
};

export default budgets;
