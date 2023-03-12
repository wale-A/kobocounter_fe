import { FilterParams, NetIncome } from "@/types";
import api from "@/api";
import { Module } from "vuex";

type State = {
  loadingRevenues: boolean;
  revenues: Array<{ date: string; amount: number }> | undefined;
  revenuesError: Error | undefined;
  loadingNetIncomes: boolean;
  netIncomes: NetIncome[] | undefined;
  netIncomesError: Error | undefined;
};

const income: Module<State, any> = {
  state: () => ({
    loadingRevenues: false,
    revenues: undefined,
    revenuesError: undefined,
    loadingNetIncomes: false,
    netIncomes: undefined,
    netIncomesError: undefined,
  }),
  getters: {
    netIncomes(state: State) {
      return state.netIncomes;
    },
    revenues(state: State) {
      return state.revenues;
    },
  },
  mutations: {
    loadingRevenues(state: State, active: boolean) {
      state.loadingRevenues = active;
    },
    setRevenue(state: State, revenues: { date: string; amount: number }[]) {
      state.revenues = revenues;
    },
    setRevenuesError(state: State, error: Error) {
      state.revenuesError = error;
      state.revenues = undefined;
    },
    loadingNetIncomes(state: State, active: boolean) {
      state.loadingNetIncomes = active;
    },
    setNetIncomes(state: State, netIncomes: NetIncome[]) {
      state.netIncomes = netIncomes;
      state.netIncomesError = undefined;
    },
    setNetIncomesError(state: State, error: Error) {
      state.netIncomesError = error;
      state.netIncomes = undefined;
    },
  },
  actions: {
    async getRevenues({ commit }, { accountId, start, end }: FilterParams) {
      try {
        commit("loadingRevenues", true);
        const res = await api.getRevenue({ accountId, start, end });
        commit("setRevenues", res.data as NetIncome[]);
      } catch (e) {
        commit("setRevenuesError", e);
      } finally {
        commit("loadingRevenues", false);
      }
    },
    async getNetIncomes({ commit }, { accountId, start, end }: FilterParams) {
      try {
        commit("loadingNetIncomes", true);
        const res = await api.getNetIncome({ accountId, start, end });
        commit("setNetIncomes", res.data as NetIncome[]);
      } catch (e) {
        commit("setNetIncomesError", e);
      } finally {
        commit("loadingNetIncomes", false);
      }
    },
  },
};

export default income;
