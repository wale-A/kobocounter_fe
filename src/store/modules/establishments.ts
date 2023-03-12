import { EstablishmentActivity, FilterParams } from "@/types";
import api from "@/api";
import { Module } from "vuex";

type State = {
  loadingEstablishmentActivities: boolean;
  establishmentActivities: EstablishmentActivity[] | undefined;
  establishmentActivitiesError: Error | undefined;
  loadingEstablishments: boolean;
  establishments: Record<string, string[]> | undefined;
  establishmentsError: Error | undefined;
};

const establishments: Module<State, any> = {
  state: () => ({
    loadingEstablishmentActivities: false,
    establishmentActivities: undefined,
    establishmentActivitiesError: undefined,
    loadingEstablishments: false,
    establishments: undefined,
    establishmentsError: undefined,
  }),
  getters: {
    establishmentActivities(state) {
      return state.establishmentActivities || [];
    },
    establishments(state) {
      return state.establishments || {};
    },
  },
  mutations: {
    loadingEstablishmentActivities(state, active: boolean) {
      state.loadingEstablishmentActivities = active;
    },
    setEstablishmentActivities(state, activities: []) {
      state.establishmentActivities = activities;
      state.establishmentActivitiesError = undefined;
    },
    setEstablishmentActivitiesError(state, error: Error) {
      state.establishmentActivitiesError = error;
      state.establishmentActivities = undefined;
    },
    loadingEstablishments(state, active: boolean) {
      state.loadingEstablishments = active;
    },
    setEstablishments(state, establishments?: Record<string, string[]>) {
      state.establishments = establishments;
      state.establishmentsError = undefined;
    },
    setEstablishmentsError(state, error: Error) {
      state.establishmentsError = error;
      state.establishments = undefined;
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
        commit("loadingEstablishmentActivities", true);
        const res = await api.getEstablishmentActivities({
          accountId,
          start,
          end,
        });
        commit("setEstablishmentActivities", res.data);
      } catch (e) {
        commit("setEstablishmentActivitiesError", e);
      } finally {
        commit("loadingEstablishmentActivities", false);
      }
    },
    async getEstablishments({ commit }) {
      try {
        commit("loadingEstablishments", true);
        const res = await api.getEstablishments();
        commit("setEstablishments", res.data as string[]);
      } catch (e) {
        commit("setEstablishmentsError", e);
      } finally {
        commit("loadingEstablishments", false);
      }
    },
  },
};

export default establishments;
