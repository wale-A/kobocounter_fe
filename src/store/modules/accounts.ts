import { Account } from "@/types";
import { Module } from "vuex";
import api from "@/api";

type State = {
  loadingAccounts: boolean;
  accounts: Account[] | undefined;
  accountsError: Error | undefined;
  accountCreateSuccessful: boolean;
};

const accounts: Module<State, any> = {
  state: () => ({
    loadingAccounts: false,
    accounts: undefined,
    accountsError: undefined,
    accountCreateSuccessful: false,
  }),
  getters: {
    accounts(state) {
      return state.accounts || [];
    },
    accountMap(_, getters) {
      return getters.accounts.reduce(
        (acc: Record<string, any>, item: Account) => ({
          ...acc,
          [item.id]: item,
        }),
        {}
      );
    },
    accountOptionsMap(_, getters) {
      return getters.accounts.map((item: Account) => ({
        value: item.id,
        label: `${item.bankName} - ${item.accountNumber}`,
      }));
    },
  },
  mutations: {
    setAccountCreateStatus(state, status: boolean) {
      state.accountCreateSuccessful = status;
    },
    loadingAccounts(state, active: boolean) {
      state.loadingAccounts = active;
    },
    setAccountsError(state, err: Error) {
      state.accountsError = err;
      state.accounts = undefined;
    },
    setAccounts(state: State, accounts: Account[]) {
      state.accounts = accounts;
      state.accountsError = undefined;
    },
  },
  actions: {
    async addAccount({ commit }, { code }: { code: string }) {
      try {
        // TODO move auth check to router
        // if (!rootState?.auth?.user) throw "";

        // TODO check response code
        await api.addAccount(code);

        commit("setAccountCreateStatus", true);
      } catch (e) {
        commit("setAccountCreateStatus", false);
      }
    },
    async getAccounts({ commit }) {
      try {
        commit("loadingAccounts", true);
        const res = await api.getAccounts();
        commit("setAccounts", res.data as Account[]);
      } catch (e) {
        commit("setAccountsError", e);
      } finally {
        commit("loadingAccounts", false);
      }
    },
    // TODO: cOMPLETE ACCOUNT REAUTH WITH MONO...
    async generateAccountReAuthCode(_, accountId: string) {
      const res = await api.reAuthAccount(accountId);
      return res.data.token;
    },
    async deleteAccount(_, accountId: string) {
      return api.deleteAccount(accountId);
    },
  },
};

export default accounts;
