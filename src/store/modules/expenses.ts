import {
  FilterParams,
  NetIncome,
  RecurrentExpense,
  ExpenseCategories,
} from "@/types";
import api from "@/api";
import { Module } from "vuex";

type State = {
  loadingExpenses: boolean;
  expenses: Array<{ date: string; amount: number }> | undefined;
  expensesError: Error | undefined;
  loadingRecurringExpenditure: boolean;
  recurringExpenditure: RecurrentExpense[] | undefined;
  recurringExpenditureError: Error | undefined;
  expenseCategories?: Array<ExpenseCategories>;
};

const expenses: Module<State, any> = {
  state: () => ({
    loadingExpenses: false,
    expenses: undefined,
    expensesError: undefined,
    loadingRecurringExpenditure: false,
    recurringExpenditure: undefined,
    recurringExpenditureError: undefined,
  }),
  getters: {
    expenses(state) {
      return state.expenses;
    },
    recurrentExpenses(state) {
      return state.recurringExpenditure || [];
    },
    topExpenses(state) {
      return state.expenseCategories?.slice(0, 3) || [];
    },
  },
  mutations: {
    loadingExpenses(state: State, active: boolean) {
      state.loadingExpenses = active;
    },
    setExpenses(state: State, expenses: { date: string; amount: number }[]) {
      state.expenses = expenses;
      state.expensesError = undefined;
    },
    setExpensesError(state: State, error: Error) {
      state.expensesError = error;
      state.expenses = undefined;
    },
    loadingRecurringExpenses(state: State, active: boolean) {
      state.loadingExpenses = active;
    },
    setRecurringExpenses(state: State, expenses: RecurrentExpense[]) {
      state.recurringExpenditure = expenses;
      state.recurringExpenditureError = undefined;
    },
    setRecurringExpensesError(state: State, error: Error) {
      state.recurringExpenditureError = error;
      state.recurringExpenditure = undefined;
    },
    setExpenseCategories(state, categories: ExpenseCategories[]) {
      state.expenseCategories = categories;
    },
  },
  actions: {
    async getExpenses({ commit }, { accountId, start, end }: FilterParams) {
      try {
        commit("loadingExpenses", true);
        const res = await api.getExpenses({ accountId, start, end });
        commit("setExpenses", res.data as NetIncome[]);
      } catch (e) {
        commit("setExpensesError", e);
      } finally {
        commit("loadingExpenses", false);
      }
    },
    async getRecurringExpenses(
      { commit },
      { accountId }: { accountId?: string }
    ) {
      try {
        commit("loadingRecurringExpenses", true);
        const res = await api.getRecurringExpenses({ accountId });
        commit("setRecurringExpenses", res.data as RecurrentExpense[]);
      } catch (e) {
        commit("setRecurringExpensesError", e);
      } finally {
        commit("loadingRecurringExpenses", true);
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
