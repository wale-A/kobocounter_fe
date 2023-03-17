import { DetailedInsights, FilterParams, Insights } from "@/types";
import api from "@/api";
import { Module } from "vuex";

type State = {
  insights: Insights[] | undefined;
  loadingInsights: boolean;
  insightsError: Error | undefined;
  detailedInsights: DetailedInsights[] | undefined;
  loadingInsight: boolean;
  insightError: Error | undefined;
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

const insights: Module<State, any> = {
  state: () => ({
    insights: undefined,
    loadingInsights: false,
    insightsError: undefined,
    detailedInsights: undefined,
    loadingInsight: false,
    insightError: undefined,
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
      state.insightsError = undefined;
    },
    loadingInsights(state: State, active: boolean) {
      state.loadingInsights = active;
    },
    setInsightsError(state: State, err: Error | undefined) {
      state.insightsError = err;
      state.insights = undefined;
    },
    setDetailedInsights(state: State, data: DetailedInsights[]) {
      state.detailedInsights = data;
      state.insightError = undefined;
    },
    loadingInsight(state: State, active: boolean) {
      state.loadingInsight = active;
    },
    setInsightError(state: State, err: Error | undefined) {
      state.insightError = err;
      state.detailedInsights = undefined;
    },
  },
  actions: {
    async getInsights({ commit }, { accountId, start, end }: FilterParams) {
      try {
        commit("loadingInsights", true);
        const res = await api.getInsights({ accountId, start, end });
        commit("setInsights", res.data as Insights[]);
      } catch (e) {
        commit("setInsightsError", e);
      } finally {
        commit("loadingInsights", false);
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
        commit("loadingInsight", true);
        const res = await api.getDetailedInsights({
          accountId,
          start,
          end,
          category,
        });
        commit("setDetailedInsights", res.data as Insights[]);
      } catch (e) {
        commit("setInsightError", e);
      } finally {
        commit("loadingInsight", false);
      }
    },
  },
};

export default insights;
