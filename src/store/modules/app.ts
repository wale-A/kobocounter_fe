import { Module } from "vuex";

type State = {
  pageLoading: boolean;
  filters: Record<string, any>;
};

const app: Module<State, any> = {
  state: () => ({
    pageLoading: false,
    filters: {},
  }),
  getters: {
    pageLoading(state) {
      return state.pageLoading;
    },
    filters(state) {
      return state.filters;
    },
  },
  mutations: {
    setLoading(state, active) {
      state.pageLoading = active;
    },
    setFilters(state, params) {
      state.filters = params;
    },
  },
};

export default app;
