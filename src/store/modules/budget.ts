import { Budget, BudgetPayload, FilterParams } from "@/types";
import api from "@/api";
import { Module } from "vuex";

type State = {
  budgets: Budget[] | undefined;
  budget: Budget | undefined;
};

const budgets: Module<State, any> = {
  state: () => ({
    budgets: undefined,
    budget: undefined,
  }),
  getters: {
    budgets(state) {
      return state.budgets || [];
    },
    budget(state) {
      return state.budget || null;
    },
  },
  mutations: {
    setBudgets(state, budgets?: Budget[]) {
      state.budgets = budgets;
    },
    setBudget(state, budget?: Budget) {
      state.budget = budget;
    },
  },
  actions: {
    async getBudgets({ commit }, { category, start, end }: FilterParams) {
      try {
        const res = await api.getBudgets({
          category,
          start,
          end,
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
    async postBudget(
      _,
      {
        id,
        payload,
      }: {
        id: string;
        payload: BudgetPayload;
      }
    ) {
      const res = await api.postBudget(id, payload);
      return res;
    },
    async deleteBudget(_, id: string) {
      const res = await api.deleteBudget(id);
      return res;
    },
  },
};

export default budgets;
