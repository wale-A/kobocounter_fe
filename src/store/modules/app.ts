import { Module } from "vuex";

type State = {
  pageLoading: boolean;
};

const app: Module<State, any> = {
  state: () => ({
    pageLoading: false,
  }),
  getters: {
    pageLoading(state) {
      return state.pageLoading;
    },
  },
  mutations: {
    setLoading(state, active) {
      state.pageLoading = active;
    },
  },
  actions: {},
};

export default app;
