import { DetailedInsights, FilterParams, Insights } from "@/types";
import api from "@/api";
import { Module } from "vuex";

type State = {
  insights: Insights[] | undefined;
  detailedInsights: DetailedInsights[] | undefined;
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
    detailedInsights: undefined,
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
    detailedInsights(state: State) {
      return state.detailedInsights;
    },
  },
  mutations: {
    setInsights(state: State, insights: Insights[]) {
      state.insights = insights;
    },
    setDetailedInsights(state: State, data: DetailedInsights[]) {
      state.detailedInsights = data;
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

    async getDetailedInsights(
      { commit },
      { accountId, start, end, category }: FilterParams
    ) {
      try {
        if (!category) {
          commit("setDetailedInsights", []);
        }

        const res = await api.getDetailedInsights({
          accountId,
          start,
          end,
          category,
        });
        commit("setDetailedInsights", res.data as Insights[]);
      } catch (e) {
        commit("setDetailedInsights", []);
      }
    },
  },
};

export default income;
