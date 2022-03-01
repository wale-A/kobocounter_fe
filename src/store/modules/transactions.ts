import { TransactionCategories, TransactionInfo, FilterParams } from "@/types";
import { Module } from "vuex";
import api from "@/api";

type State = {
  transactions: TransactionInfo[] | undefined;
  transactionCategories: TransactionCategories[] | undefined;
};

const transactions: Module<State, any> = {
  state: () => ({
    transactions: undefined,
    transactionCategories: undefined,
  }),
  mutations: {
    setTransactions(state, transactions?: TransactionInfo[]) {
      state.transactions = transactions;
    },
    setTransactionCategories(state, categories?: TransactionCategories[]) {
      state.transactionCategories = categories;
    },
    updateTransaction(state, updatedTransaction: TransactionInfo) {
      if (!(state.transactions && state.transactions.length > 0)) return;

      const index = state.transactions.findIndex(
        (x: TransactionInfo) => x.id === updatedTransaction.id
      );
      if (index == -1) return;
      state.transactions.splice(index, 1, updatedTransaction);
    },
  },
  actions: {
    async getTransactions(
      { commit, rootState },
      { accountId, start, end }: FilterParams
    ) {
      try {
        // TODO move auth check to router
        if (!rootState.user) throw "";
        const res = await api.getTransactions({ accountId, start, end });
        commit("setTransactions", res.data as TransactionInfo[]);
      } catch (e) {
        commit("setTransactions", []);
      }
    },
    async getTransactionCategories(
      { commit },
      { accountId, start, end }: FilterParams
    ) {
      try {
        const res = await api.getTransactionCategories({
          accountId,
          start,
          end,
        });
        commit("setTransactionCategories", res.data as TransactionCategories[]);
      } catch (e) {
        commit("setTransactionCategories", []);
      }
    },
    async updateTransaction(
      { commit },
      {
        transactionId,
        params,
        updatedTransaction,
        callback,
      }: {
        transactionId: string;
        params: string;
        updatedTransaction: TransactionInfo;
        callback: (success: boolean) => void;
      }
    ) {
      try {
        const res = await api.updateTransaction(transactionId, params);
        if (res.status === 201) {
          commit("updateTransaction", updatedTransaction);
          callback(true);
        } else {
          callback(false);
        }
      } catch (e) {
        callback(false);
      }
    },
    async saveSplitTransactions(
      { dispatch },
      {
        transactionId,
        params,
        callback,
      }: {
        transactionId: string;
        params: string;
        callback: (success: boolean) => void;
      }
    ) {
      try {
        const res = await api.splitTransctions(transactionId, params);

        if (res.status === 201) {
          dispatch("getTransactions", {});
          callback(true);
        } else {
          callback(false);
        }
      } catch (e) {
        callback(false);
      }
    },
  },
  getters: {
    transactions(state: State) {
      return state.transactions;
    },
    transactionCategories(state: State) {
      return state.transactionCategories;
    },
  },
};

export default transactions;
