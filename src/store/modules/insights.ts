import { FilterParams, Insights } from "@/types";
import api from "@/api";
import { Module } from "vuex";

type State = {
  insights: Insights[] | undefined;
};

const income: Module<State, any> = {
  state: () => ({
    insights: undefined,
  }),
  getters: {
    insights(state: State) {
      return state.insights;
    },
  },
  mutations: {
    setInsights(state: State, insights: Insights[]) {
      state.insights = insights;
    },
  },
  actions: {
    async getInsights({ commit }, { accountId, start, end }: FilterParams) {
      try {
        const res = await api.getInsights({ accountId, start, end });
        commit("setInsights", res.data as Insights[]);
      } catch (e) {
        commit("setInsights", []);
      }
    },
  },
};

export default income;
