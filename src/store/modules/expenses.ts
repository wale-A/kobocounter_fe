import {
  FilterParams,
  NetIncome,
  RecurrentExpense,
  ExpenseCategories,
} from "@/types";
import api from "@/api";
import { Module } from "vuex";

type State = {
  recurringExpenditure: RecurrentExpense[] | undefined;
  expense?: Array<{ date: string; amount: number }>;
  expenseCategories?: Array<ExpenseCategories>;
};

const expenses: Module<State, any> = {
  state: () => ({
    recurringExpenditure: undefined,
  }),
  getters: {
    expense(state) {
      return state.expense;
    },
    recurrentExpenses(state) {
      return state.recurringExpenditure || [];
    },
    topExpenses(state) {
      return state.expenseCategories?.slice(0, 3) || [];
    },
  },
  mutations: {
    setExpense(state: State, expense?: { date: string; amount: number }[]) {
      state.expense = expense;
    },
    setRecurringExpenses(state: State, subscription?: RecurrentExpense[]) {
      state.recurringExpenditure = subscription;
    },
    setExpenseCategories(state, categories: ExpenseCategories[]) {
      state.expenseCategories = categories;
    },
  },
  actions: {
    async getExpense({ commit }, { accountId, start, end }: FilterParams) {
      try {
        const res = await api.getExpenses({ accountId, start, end });
        commit("setExpense", res.data as NetIncome[]);
      } catch (e) {
        commit("setExpense", []);
      }
    },
    async getRecurringExpenses(
      { commit },
      { accountId }: { accountId?: string }
    ) {
      try {
        const res = await api.getRecurringExpenses({ accountId });

        commit("setRecurringExpenses", res.data as RecurrentExpense[]);
      } catch (e) {
        commit("setRecurringExpenses", []);
      }
    },
    async getExpenseCategories(
      { commit },
      { accountId, start, end }: FilterParams
    ) {
      try {
        const res = await api.getExpenseCategories({
          accountId,
          start,
          end,
        });
        commit("setExpenseCategories", res.data as ExpenseCategories[]);
      } catch (e) {
        commit("setExpenseCategories", []);
      }
    },
  },
};

export default expenses;
