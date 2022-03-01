import { EstablishmentActivity, FilterParams } from "@/types";
import api from "@/api";
import { Module } from "vuex";

type State = {
  establishmentActivities: EstablishmentActivity[] | undefined;
  establishments: Record<string, string[]> | undefined;
};

const establishments: Module<State, any> = {
  state: () => ({
    establishmentActivities: undefined,
    establishments: undefined,
  }),
  mutations: {
    setEstablishmentActivities(state, activities?: []) {
      state.establishmentActivities = activities;
    },
    setEstablishments(state, establishments?: Record<string, string[]>) {
      state.establishments = establishments;
    },
    insertActivity(
      state,
      { establishment, activity }: { establishment: string; activity: string }
    ) {
      if (state.establishments && state.establishments[establishment]) {
        state.establishments[establishment].push(activity);
      }
    },
    insertEstablishment(state, establishment: string) {
      if (!state.establishments) {
        state.establishments = {};
      }
      state.establishments[establishment] = [];
    },
  },
  actions: {
    async getEstablishmentActivities(
      { commit },
      { accountId, start, end }: FilterParams
    ) {
      try {
        const res = await api.getEstablishmentActivities({
          accountId,
          start,
          end,
        });
        commit("setEstablishmentActivities", res.data);
      } catch (e) {
        commit("setEstablishmentActivities", []);
      }
    },
    async getEstablishments({ commit }) {
      try {
        const res = await api.getEstablishments();
        commit("setEstablishments", res.data as string[]);
      } catch (e) {
        commit("setEstablishments", []);
      }
    },
  },
  getters: {
    establishmentActivities(state) {
      return state.establishmentActivities || [];
    },
    establishments(state) {
      return state.establishments || {};
    },
  },
};

export default establishments;
