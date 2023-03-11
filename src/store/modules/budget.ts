import {
  Budget,
  BudgetListItem,
  BudgetListResponse,
  BudgetPayload,
  FilterParams,
  Pagination,
} from "@/types";
import api from "@/api";
import { differenceInDays } from "date-fns";
import { Module } from "vuex";
import { justDate, getBudgetName } from "@/util";

type State = {
  loadingBudget: boolean;
  budget: Budget | undefined;
  budgetError: Error | undefined;
  loadingBudgets: boolean;
  budgets: BudgetListItem[] | undefined;
  pagination: Pagination | undefined;
  budgetsError: Error | undefined;
};

const budgets: Module<State, any> = {
  state: () => ({
    loadingBudget: false,
    budget: undefined,
    budgetError: undefined,
    loadingBudgets: false,
    budgets: undefined,
    pagination: undefined,
    budgetsError: undefined,
  }),
  getters: {
    budgets(state) {
      return state.budgets
        ?.map((item) => ({
          ...item,
          startDate: justDate(item.startDate),
          endDate: justDate(item.startDate),
          name: getBudgetName(item.startDate, "monthly"),
        }))
        .sort((itemA, itemB) =>
          differenceInDays(new Date(itemA.endDate), new Date(itemB.endDate))
        );
    },
    budgetMap(_, getters) {
      return (getters.budgets || []).reduce(
        (acc: Record<string, BudgetListItem>, item: BudgetListItem) => ({
          ...acc,
          [item.id]: item,
        }),
        {}
      );
    },
    lastBudget(state) {
      const last =
        state.budgets?.length && state.budgets[state.budgets.length - 1];
      return last;
    },
    budget(state) {
      return state.budget;
    },
  },
  mutations: {
    loadBudgets(state, active: boolean) {
      state.loadingBudgets = active;
    },
    setBudgets(state, budgets: BudgetListResponse) {
      state.budgets = budgets.data;
      state.budgetsError = undefined;
    },
    budgetsError(state, err: Error) {
      state.budgetsError = err;
      state.budgets = undefined;
    },
    loadBudget(state, active: boolean) {
      state.loadingBudget = active;
    },
    setBudget(state, budget: Budget) {
      state.budget = budget;
      state.budgetError = undefined;
    },
    budgetError(state, err: Error) {
      state.budgetError = err;
      state.budget = undefined;
    },
  },
  actions: {
    async getBudgets(
      { commit },
      { category, start, end, page, size }: FilterParams
    ) {
      try {
        commit("loadBudgets", true);
        const res = await api.getBudgets({
          category,
          start,
          end,
          page,
          size,
        });
        commit("setBudgets", res.data);
      } catch (e) {
        commit("budgetsError", e);
      } finally {
        commit("loadBudgets", false);
      }
    },
    async getBudget({ commit }, id: string) {
      try {
        commit("loadBudget", true);
        const res = await api.getBudget(id);
        commit("setBudget", res.data);
      } catch (e) {
        commit("budgetError", e);
      } finally {
        commit("loadBudget", false);
      }
    },
    async postBudget(_, payload: BudgetPayload) {
      const res = await api.postBudget(payload);
      return res;
    },
    async putBudget(
      _,
      { id, payload }: { id: string; payload: BudgetPayload }
    ) {
      const res = await api.putBudget(id, payload);
      return res;
    },
    async deleteBudget(_, id: string) {
      const res = await api.deleteBudget(id);
      return res;
    },
    // TODO: remove
    async getSingleBudget({ commit }, id: string) {
      try {
        commit("loadBudget", true);
        const res = await api.getSingleBudget(id);
        commit("setBudget", res.data);
      } catch (e) {
        commit("setBudgetError", e);
      } finally {
        commit("loadBudget", false);
      }
    },
  },
};

export default budgets;
