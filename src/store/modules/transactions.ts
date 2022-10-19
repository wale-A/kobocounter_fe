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
  allExpenseCategories: KeyValue;
  allTransactionCategories: KeyValue;
};

const transactions: Module<State, any> = {
  state: () => ({
    transactions: [],
    transactionCategories: [],
    pagination: undefined,
    allExpenseCategories: [],
    allTransactionCategories: [],
  }),
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
      return [
        ...getters.allTransactionCategories,
        ...getters.allExpenseCategories,
      ];
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
    allExpenseCategories(state) {
      return state.allExpenseCategories;
    },
    allTransactionCategories(state) {
      return state.allTransactionCategories;
    },
  },
  mutations: {
    setTransactions(state, res: TransactionResponse) {
      if (res.meta.page <= 1) {
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
              name: model.recipientName as string,
            }
          : ({} as Establishment);
        const displayCategory = state.allTransactionCategories.find(
          (x) => x.value == model.transactionCategory
        )?.label;
        if (displayCategory) {
          transaction.displayCategory = displayCategory;
          transaction.recipient = model.recipientName as string;
          transaction.establishment = establishment;
          transaction.expenseCategory = state.allExpenseCategories.find(
            (x) => x.value == model.expenseCategory
          )?.label;
        }
      }
    },
    setAllExpenseCategories(state: State, expenseCategories: KeyValue) {
      state.allExpenseCategories = expenseCategories;
    },
    setAllTransactionCategories(state: State, transactionCategories: KeyValue) {
      state.allTransactionCategories = transactionCategories;
    },
  },
  actions: {
    async getTransactions(
      { commit },
      { accountId, start, end, category, page, size, search }: FilterParams
    ) {
      try {
        const res = await api.getTransactions({
          accountId,
          start,
          end,
          category,
          page,
          size,
          search,
        });
        commit("setTransactions", res.data);
      } catch (e) {
        commit("setTransactions", { data: [], meta: undefined });
      }
    },
    async getTransactionCategories(
      { commit },
      { accountId, start, end, expenses }: FilterParams
    ) {
      try {
        const res = await api.getTransactionCategories({
          accountId,
          start,
          end,
          expenses,
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
    async getAllExpenseCategories({ commit }) {
      try {
        const res = await api.getAllExpenseCategories();
        commit("setAllExpenseCategories", res.data as KeyValue);
      } catch (e) {
        commit("setAllExpenseCategories", []);
      }
    },
    async getAllTransactionCategories({ commit }) {
      try {
        const res = await api.getAllTransactionCategories();
        commit("setAllTransactionCategories", res.data as KeyValue);
      } catch (e) {
        commit("setAllTransactionCategories", []);
      }
    },
  },
};

export default transactions;

type KeyValue = { value: number; label: string }[];
