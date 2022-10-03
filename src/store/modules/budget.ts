import {
  Budget,
  BudgetListItem,
  BudgetListResponse,
  FilterParams,
  Pagination,
} from "@/types";
import api from "@/api";
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
      return state.budgets || [];
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
