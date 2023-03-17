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
    setLoadingBudgets(state, active: boolean) {
      state.loadingBudgets = active;
    },
    setBudgets(state, budgets: BudgetListResponse) {
      state.budgets = budgets.data;
      state.budgetsError = undefined;
    },
    setBudgetsError(state, err: Error) {
      state.budgetsError = err;
      state.budgets = undefined;
    },
    setLoadingBudget(state, active: boolean) {
      state.loadingBudget = active;
    },
    setBudget(state, budget: Budget) {
      state.budget = budget;
      state.budgetError = undefined;
    },
    setBudgetError(state, err: Error) {
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
        commit("setLoadingBudgets", true);
        const res = await api.getBudgets({
          category,
          start,
          end,
          page,
          size,
        });
        commit("setBudgets", res.data);
      } catch (e) {
        commit("setBudgetsError", e);
      } finally {
        commit("setLoadingBudgets", false);
      }
    },
    async getBudget({ commit }, id: string) {
      try {
        commit("setLoadingBudget", true);
        const res = await api.getBudget(id);
        commit("setBudget", res.data);
      } catch (e) {
        commit("setBudgetError", e);
      } finally {
        commit("setLoadingBudget", false);
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
        commit("loadingBudget", true);
        const res = await api.getSingleBudget(id);
        commit("setBudget", res.data);
      } catch (e) {
        commit("setBudgetError", e);
      } finally {
        commit("loadingBudget", false);
      }
    },
  },
};

export default budgets;
