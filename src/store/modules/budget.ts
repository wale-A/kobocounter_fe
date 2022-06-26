import { Budget, FilterParams } from "@/types";
import api from "@/api";
import { Module } from "vuex";

type State = {
  budgets: Budget[] | undefined;
};

const budgets: Module<State, any> = {
  state: () => ({
    budgets: undefined,
  }),
  getters: {
    budgets(state) {
      return state.budgets || [];
    },
  },
  mutations: {
    setBudgets(state, budgets?: Budget[]) {
      state.budgets = budgets;
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
  },
};

export default budgets;
