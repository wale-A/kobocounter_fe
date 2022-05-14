import {
  TransactionCategories,
  TransactionInfo,
  FilterParams,
  TransactionPayload,
  SplitTransaction,
} from "@/types";
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
    setTransactions(state, transactions: TransactionInfo[]) {
      state.transactions = transactions;
    },
    setTransactionCategories(state, categories: TransactionCategories[]) {
      state.transactionCategories = categories;
    },
    updateTransaction(state, model: TransactionPayload) {
      if (!(state.transactions && state.transactions.length > 0)) return;

      const transaction = state.transactions.find(
        (x: TransactionInfo) => x.id === model.id
      );

      if (transaction) {
        type Establishment = {
          name: string;
          activities: string[];
        };
        const establishment = model.isEstablishment
          ? {
              activities: model.establishmentActivities,
              name: model.recipientName,
            }
          : ({} as Establishment);
        transaction.displayCategory = model.displayCategory;
        transaction.recipient = model.recipientName;
        transaction.establishment = establishment;
      }
    },
  },
  actions: {
    async getTransactions({ commit }, { accountId, start, end }: FilterParams) {
      try {
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
        model,
      }: {
        transactionId: string;
        model: TransactionPayload;
      }
    ) {
      const res = await api.updateTransaction(transactionId, model);
      if (res.data.id) {
        commit("updateTransaction", model);
      } else {
        throw res.data;
      }
    },
    async saveSplitTransactions(
      { dispatch },
      {
        transactionId,
        payload,
      }: {
        transactionId: string;
        payload: SplitTransaction[];
      }
    ) {
      const res = await api.splitTransctions(transactionId, payload);
      if (res.status === 201) {
        dispatch("getTransactions", {});
      } else {
        throw res.data;
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
