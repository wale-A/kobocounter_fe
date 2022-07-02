import { FilterParams, Insights } from "@/types";
import api from "@/api";
import { Module } from "vuex";

type State = {
  insights: Insights[] | undefined;
};

function getHash(input: string) {
  let hash = 0;
  const len = input.length;
  for (let i = 0; i < len; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0; // to 32bit integer
  }
  return Math.abs(hash);
}

const income: Module<State, any> = {
  state: () => ({
    insights: undefined,
  }),
  getters: {
    rawInsights(state: State) {
      return state.insights;
    },
    insights(state: State, getters) {
      if (!getters.rawInsights) {
        return [];
      }
      return getters.rawInsights.map((item: Insights) => ({
        ...item,
        id: getHash(item.category),
      }));
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
