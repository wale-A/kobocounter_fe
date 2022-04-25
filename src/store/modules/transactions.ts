import {
  TransactionCategories,
  TransactionInfo,
  FilterParams,
  TransactionPayload,
  SplitTransaction,
  Pagination,
  TransactionResponse,
  Transaction,
} from "@/types";
import { Module } from "vuex";
import api from "@/api";

type State = {
  transactions: TransactionInfo[];
  pagination: Pagination | undefined;
  transactionCategories: TransactionCategories[];
};

const transactions: Module<State, any> = {
  state: () => ({
    transactions: [],
    transactionCategories: [],
    pagination: undefined,
  }),
  mutations: {
    setTransactions(state, res: TransactionResponse) {
      if (res.meta.page == 1) {
        state.transactions = res.data;
      } else {
        state.transactions = state.transactions.concat(res.data);
      }
      state.pagination = res.meta;
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
    async getTransactions(
      { commit },
      { accountId, start, end, category, page, size }: FilterParams
    ) {
      try {
        const res = await api.getTransactions({
          accountId,
          start,
          end,
          category,
          page,
          size,
        });
        commit("setTransactions", res.data);
      } catch (e) {
        commit("setTransactions", { data: [], meta: undefined });
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
    groupedTransactions(_, getters) {
      const sortedTransactions = getters.transactions;
      const group: Record<string, Transaction[]> = {};
      for (let i = 0; i < sortedTransactions?.length || 0; i++) {
        const date = new Date(sortedTransactions[i].date).toDateString();
        const txn = sortedTransactions[i] as Transaction;
        group[date] = (group[date] || []).concat(txn);
      }
      return group;
    },
    transactionCategories(state: State) {
      if (!state.transactionCategories) {
        return [];
      }
      return state.transactionCategories;
    },
    categoryOptionsMap(_, getters) {
      return getters.transactionCategories.map(
        (item: TransactionCategories) => ({
          value: item.category,
          label: item.displayCategory,
        })
      );
    },
    canLoadMore(state: State) {
      if (!state.pagination) {
        return false;
      }

      return (
        state.pagination.total / state.pagination.size > state.pagination.page
      );
    },
    nextPageParams(state: State) {
      if (!state.pagination) {
        return {
          page: 1,
          size: 20,
        };
      }

      return {
        page: state.pagination.page + 1,
        size: state.pagination.size,
      };
    },
  },
};

export default transactions;
