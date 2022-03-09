import { FilterParams, NetIncome } from "@/types";
import api from "@/api";
import { Module } from "vuex";

type State = {
  netIncome: NetIncome[] | undefined;
  revenue?: Array<{ date: string; amount: number }>;
};

const income: Module<State, any> = {
  state: () => ({
    netIncome: undefined,
  }),
  mutations: {
    setRevenue(state: State, revenue?: { date: string; amount: number }[]) {
      state.revenue = revenue;
    },
    setNetIncome(state: State, netIncome?: NetIncome[]) {
      state.netIncome = netIncome;
    },
  },
  actions: {
    async getNetIncome({ commit }, { accountId, start, end }: FilterParams) {
      try {
        const res = await api.getNetIncome({ accountId, start, end });
        commit("setNetIncome", res.data as NetIncome[]);
      } catch (e) {
        commit("setNetIncome", []);
      }
    },
    async getRevenue({ commit }, { accountId, start, end }: FilterParams) {
      try {
        const res = await api.getRevenue({ accountId, start, end });
        commit("setRevenue", res.data as NetIncome[]);
      } catch (e) {
        commit("setRevenue", []);
      }
    },
  },
  getters: {
    netIncome(state: State) {
      return state.netIncome;
    },
    revenue(state: State) {
      return state.revenue;
    },
  },
};

export default income;
